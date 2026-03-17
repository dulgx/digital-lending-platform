from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.loan import Loan
from app.models.repayment import Repayment
from app.models.user import User
from app.schemas.repayment import RepaymentResponse

router = APIRouter(prefix="/repayment", tags=["Repayment"])


@router.get("/{loan_id}", response_model=list[RepaymentResponse])
def get_repayment_schedule(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    loan = db.get(Loan, loan_id)
    if not loan or loan.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Loan not found")

    return (
        db.query(Repayment)
        .filter(Repayment.loan_id == loan_id)
        .order_by(Repayment.installment_number)
        .all()
    )
