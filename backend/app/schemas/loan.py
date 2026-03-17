from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from app.models.loan_application import ApplicationStatus
from app.models.loan import LoanStatus


# --- Loan Application ---

class LoanApplyRequest(BaseModel):
    amount: Decimal
    term_months: int


class LoanApplicationResponse(BaseModel):
    id: int
    user_id: int
    amount: Decimal
    term_months: int
    score: int | None
    status: ApplicationStatus
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Loan ---

class LoanResponse(BaseModel):
    id: int
    user_id: int
    application_id: int
    principal: Decimal
    interest_rate: Decimal
    term_months: int
    monthly_payment: Decimal
    status: LoanStatus
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Admin decision override ---

class AdminDecisionRequest(BaseModel):
    application_id: int
    decision: ApplicationStatus  # approved / rejected
    note: str | None = None
