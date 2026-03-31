from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlalchemy.orm import Session
import json

from app.core.database import get_db
from app.core.security import get_api_key_user
from app.models.user import User
from app.models.loan_application import LoanApplication, ApplicationStatus
from app.schemas.b2b import B2BLoanApplyRequest
from app.services.smart_scoring import analyze_transactions
from app.services.scoring import calculate_score
from app.services.webhook_service import fire_webhook_event

router = APIRouter(prefix="/b2b", tags=["B2B API Integration"])


@router.post("/apply", status_code=status.HTTP_201_CREATED)
def apply_b2b_loan(
    body: B2BLoanApplyRequest,
    background_tasks: BackgroundTasks,
    partner_user: User = Depends(get_api_key_user),
    db: Session = Depends(get_db)
):
    # 1. Analyze transactions using Smart Decision Engine
    analysis = analyze_transactions(body.transactions)
    smart_score_impact = analysis["smart_score"]
    
    # 2. Traditional + Smart Score combined
    score_result = calculate_score(
        salary=float(body.customer.salary),
        loan_amount=float(body.amount),
        term_months=body.term_months,
        age=body.customer.age,
        smart_score_impact=smart_score_impact
    )
    
    # 3. Decision
    final_status = ApplicationStatus.APPROVED if score_result.risk_band in ["A", "B", "C", "D"] else ApplicationStatus.REJECTED
    
    # Optional: If gambling is detected, push to manual review
    if "gambling" in " ".join(analysis["reasons"]).lower():
        final_status = ApplicationStatus.REVIEW

    # 4. Save to Database
    # Notice we save it under the partner_user ID, but we flag it is_b2b and store the customer metadata
    customer_info_dict = body.customer.model_dump()
    customer_info_dict["transactions_analysis_reasons"] = analysis["reasons"]

    application = LoanApplication(
        user_id=partner_user.id,
        amount=body.amount,
        term_months=body.term_months,
        score=score_result.score,
        status=final_status,
        is_b2b=True,
        customer_data=customer_info_dict
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    # 5. Trigger Webhook asynchronously
    payload = {
        "application_id": application.id,
        "status": final_status.value,
        "amount": str(body.amount),
        "score": score_result.score,
        "customer_register": body.customer.register_no
    }
    background_tasks.add_task(fire_webhook_event, db, partner_user.id, "loan.status.updated", payload)

    return {
        "application_id": application.id,
        "decision": final_status,
        "score": score_result.score,
        "risk_band": score_result.risk_band,
        "smart_reasons": analysis["reasons"]
    }
