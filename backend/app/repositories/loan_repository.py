from sqlalchemy.orm import Session
from app.models.loan_application import LoanApplication
from app.models.loan import Loan
from app.models.repayment import Repayment

class LoanRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_applications_by_user(self, user_id: int):
        return self.db.query(LoanApplication).filter(LoanApplication.user_id == user_id).all()

    def get_loan_by_id(self, loan_id: int):
        return self.db.get(Loan, loan_id)

    def get_repayments_by_loan(self, loan_id: int):
        return self.db.query(Repayment).filter(Repayment.loan_id == loan_id).order_by(Repayment.installment_number).all()

    def save_application_flow(self, application: LoanApplication, loan: Loan | None, schedule: list[dict]):
        self.db.add(application)
        self.db.flush()
        
        if loan:
            loan.application_id = application.id
            self.db.add(loan)
            self.db.flush()
            
            for s in schedule:
                s["loan_id"] = loan.id
            self.db.bulk_insert_mappings(Repayment, schedule)

        self.db.commit()
        self.db.refresh(application)
        return application
