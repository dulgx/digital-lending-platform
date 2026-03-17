from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.loan_application import LoanApplication, ApplicationStatus
from app.models.loan import Loan
from app.models.repayment import Repayment
from app.models.user import User
from app.schemas.loan import LoanApplyRequest, LoanApplicationResponse, LoanResponse
from app.services.scoring import calculate_score
from app.services.decision import (
    get_decision,
    calculate_monthly_payment,
    generate_repayment_schedule,
    DEFAULT_MONTHLY_INTEREST_RATE,
)

router = APIRouter(prefix="/loan", tags=["Loan"])


@router.post("/apply", response_model=LoanApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_for_loan(
    body: LoanApplyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.salary is None or current_user.age is None:
        raise HTTPException(
            status_code=400,
            detail="Please complete your profile (salary and age) before applying.",
        )

    # 1. Score
    result = calculate_score(
        salary=float(current_user.salary),
        loan_amount=float(body.amount),
        age=current_user.age,
    )

    # 2. Decision
    decision = get_decision(result.score)

    # 3. Save application
    application = LoanApplication(
        user_id=current_user.id,
        amount=body.amount,
        term_months=body.term_months,
        score=result.score,
        status=decision,
    )
    db.add(application)
    db.flush()  # get application.id before commit

    # 4. If approved → create loan + repayment schedule
    if decision == ApplicationStatus.APPROVED:
        monthly_payment = calculate_monthly_payment(
            principal=Decimal(str(body.amount)),
            monthly_rate=DEFAULT_MONTHLY_INTEREST_RATE,
            term_months=body.term_months,
        )
        loan = Loan(
            user_id=current_user.id,
            application_id=application.id,
            principal=body.amount,
            interest_rate=DEFAULT_MONTHLY_INTEREST_RATE,
            term_months=body.term_months,
            monthly_payment=monthly_payment,
        )
        db.add(loan)
        db.flush()

        schedule = generate_repayment_schedule(
            loan_id=loan.id,
            principal=Decimal(str(body.amount)),
            term_months=body.term_months,
            monthly_payment=monthly_payment,
        )
        db.bulk_insert_mappings(Repayment, schedule)

    db.commit()
    db.refresh(application)
    return application


@router.get("/applications", response_model=list[LoanApplicationResponse])
def my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(LoanApplication).filter(LoanApplication.user_id == current_user.id).all()


@router.get("/{loan_id}", response_model=LoanResponse)
def get_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    loan = db.get(Loan, loan_id)
    if not loan or loan.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan
