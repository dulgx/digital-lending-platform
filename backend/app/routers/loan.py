from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.loan import LoanApplyRequest, LoanApplicationResponse, LoanResponse
from app.services.loan_service import LoanService
from app.repositories.loan_repository import LoanRepository

router = APIRouter(prefix="/loan", tags=["Loan"])


def get_loan_service(db: Session = Depends(get_db)):
    return LoanService(LoanRepository(db))


@router.post("/apply", response_model=LoanApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_for_loan(
    body: LoanApplyRequest,
    current_user: User = Depends(get_current_user),
    loan_service: LoanService = Depends(get_loan_service),
):
    return loan_service.apply_for_loan(body, current_user)


@router.get("/applications", response_model=list[LoanApplicationResponse])
def my_applications(
    current_user: User = Depends(get_current_user),
    loan_service: LoanService = Depends(get_loan_service),
):
    return loan_service.get_my_applications(current_user)


@router.get("/{loan_id}", response_model=LoanResponse)
def get_loan(
    loan_id: int,
    current_user: User = Depends(get_current_user),
    loan_service: LoanService = Depends(get_loan_service),
):
    return loan_service.get_loan(loan_id, current_user)
