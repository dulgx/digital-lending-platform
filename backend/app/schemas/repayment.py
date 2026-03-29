from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel

from app.models.repayment import RepaymentStatus


class RepaymentResponse(BaseModel):
    id: int
    loan_id: int
    installment_number: int
    due_date: date
    amount: Decimal
    principal_payment: Decimal
    interest_payment: Decimal
    balance_remaining: Decimal
    status: RepaymentStatus
    paid_at: datetime | None

    model_config = {"from_attributes": True}
