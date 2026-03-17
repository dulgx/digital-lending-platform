from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_admin
from app.models.loan_application import LoanApplication, ApplicationStatus
from app.models.user import User
from app.schemas.loan import LoanApplicationResponse, AdminDecisionRequest

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

    # Only allow override on REVIEW or PENDING applications
    if application.status not in (ApplicationStatus.REVIEW, ApplicationStatus.PENDING):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot override a '{application.status}' application",
        )

    application.status = body.decision
    application.admin_note = body.note
    db.commit()
    db.refresh(application)
    return application
