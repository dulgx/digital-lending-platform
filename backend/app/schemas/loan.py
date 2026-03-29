from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.loan_application import ApplicationStatus
from app.models.loan import LoanStatus


# --- Loan Application ---

class LoanApplyRequest(BaseModel):
    amount: Decimal = Field(gt=0, le=50_000_000, description="Зээлийн дүн (1–50,000,000)")
    term_months: int = Field(ge=1, le=60, description="Зээлийн хугацаа сараар (1–60)")


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
