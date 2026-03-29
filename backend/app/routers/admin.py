from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.loan import Loan
from app.models.loan_application import LoanApplication, ApplicationStatus
from app.models.repayment import Repayment
from app.models.user import User
from app.schemas.loan import LoanApplicationResponse, AdminDecisionRequest
from app.services.scoring import calculate_score
from app.services.decision import calculate_monthly_payment, generate_repayment_schedule

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/applications", response_model=list[LoanApplicationResponse])
def list_all_applications(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return db.query(LoanApplication).order_by(LoanApplication.created_at.desc()).all()


@router.post("/decision", response_model=LoanApplicationResponse)
def override_decision(
    body: AdminDecisionRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    application = db.get(LoanApplication, body.application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if application.status not in (ApplicationStatus.REVIEW, ApplicationStatus.PENDING):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot override a '{application.status}' application",
        )

    application.status = body.decision
    application.admin_note = body.note

    if body.decision == ApplicationStatus.APPROVED:
        user = db.get(User, application.user_id)
        if user and user.salary is not None and user.age is not None:
            score_result = calculate_score(
                salary=float(user.salary),
                loan_amount=float(application.amount),
                term_months=application.term_months,
                age=user.age,
            )
            monthly_payment = calculate_monthly_payment(
                principal=Decimal(str(application.amount)),
                monthly_rate=score_result.interest_rate,
                term_months=application.term_months,
            )
            loan = Loan(
                user_id=application.user_id,
                application_id=application.id,
                principal=application.amount,
                interest_rate=score_result.interest_rate,
                term_months=application.term_months,
                monthly_payment=monthly_payment,
            )
            db.add(loan)
            db.flush()

            schedule = generate_repayment_schedule(
                loan_id=loan.id,
                principal=Decimal(str(application.amount)),
                term_months=application.term_months,
                monthly_payment=monthly_payment,
                monthly_rate=score_result.interest_rate,
            )
            db.bulk_insert_mappings(Repayment, schedule)

    db.commit()
    db.refresh(application)
    return application
