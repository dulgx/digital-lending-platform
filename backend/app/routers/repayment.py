from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.repayment import RepaymentResponse
from app.services.loan_service import LoanService
from app.repositories.loan_repository import LoanRepository

router = APIRouter(prefix="/repayment", tags=["Repayment"])


def get_loan_service(db: Session = Depends(get_db)):
    return LoanService(LoanRepository(db))


@router.get("/{loan_id}", response_model=list[RepaymentResponse])
def get_repayment_schedule(
    loan_id: int,
    current_user: User = Depends(get_current_user),
    loan_service: LoanService = Depends(get_loan_service),
):
    return loan_service.get_repayment_schedule(loan_id, current_user)

@router.get("/application/{application_id}", response_model=list[RepaymentResponse])
def get_repayment_schedule_by_app(
    application_id: int,
    current_user: User = Depends(get_current_user),
    loan_service: LoanService = Depends(get_loan_service),
):
    return loan_service.get_repayment_schedule_by_application(application_id, current_user)

@router.post("/{repayment_id}/pay", response_model=RepaymentResponse)
def pay_installment(
    repayment_id: int,
    current_user: User = Depends(get_current_user),
    loan_service: LoanService = Depends(get_loan_service),
):
    return loan_service.pay_installment(repayment_id, current_user)
