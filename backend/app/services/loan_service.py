from decimal import Decimal
from fastapi import HTTPException
from app.models.user import User
from app.models.loan_application import LoanApplication, ApplicationStatus
from app.models.loan import Loan
from app.schemas.loan import LoanApplyRequest
from app.services.scoring import calculate_score
from app.services.decision import (
    get_decision,
    calculate_monthly_payment,
    generate_repayment_schedule,
    DEFAULT_MONTHLY_INTEREST_RATE,
)
from app.repositories.loan_repository import LoanRepository

class LoanService:
    def __init__(self, loan_repo: LoanRepository):
        self.loan_repo = loan_repo

    def apply_for_loan(self, body: LoanApplyRequest, current_user: User):
        if current_user.salary is None or current_user.age is None:
            raise HTTPException(
                status_code=400,
                detail="Please complete your profile (salary and age) before applying.",
            )

        result = calculate_score(
            salary=float(current_user.salary),
            loan_amount=float(body.amount),
            age=current_user.age,
        )

        decision = get_decision(result.score)

        application = LoanApplication(
            user_id=current_user.id,
            amount=body.amount,
            term_months=body.term_months,
            score=result.score,
            status=decision,
        )

        loan = None
        schedule = []

        if decision == ApplicationStatus.APPROVED:
            monthly_payment = calculate_monthly_payment(
                principal=Decimal(str(body.amount)),
                monthly_rate=DEFAULT_MONTHLY_INTEREST_RATE,
                term_months=body.term_months,
            )
            loan = Loan(
                user_id=current_user.id,
                principal=body.amount,
                interest_rate=DEFAULT_MONTHLY_INTEREST_RATE,
                term_months=body.term_months,
                monthly_payment=monthly_payment,
            )
            schedule = generate_repayment_schedule(
                loan_id=0, # will be updated in repo
                principal=Decimal(str(body.amount)),
                term_months=body.term_months,
                monthly_payment=monthly_payment,
            )

        return self.loan_repo.save_application_flow(application, loan, schedule)

    def get_my_applications(self, current_user: User):
        return self.loan_repo.get_applications_by_user(current_user.id)

    def get_loan(self, loan_id: int, current_user: User):
        loan = self.loan_repo.get_loan_by_id(loan_id)
        if not loan or loan.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Loan not found")
        return loan

    def get_repayment_schedule(self, loan_id: int, current_user: User):
        loan = self.loan_repo.get_loan_by_id(loan_id)
        if not loan or loan.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Loan not found")
        return self.loan_repo.get_repayments_by_loan(loan_id)
