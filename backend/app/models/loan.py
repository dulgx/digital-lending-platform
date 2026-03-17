from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class LoanStatus(str, enum.Enum):
    ACTIVE = "active"
    PAID = "paid"
    DEFAULTED = "defaulted"


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("loan_applications.id"), nullable=False)

    principal = Column(Numeric(15, 2), nullable=False)
    interest_rate = Column(Numeric(5, 4), nullable=False)  # e.g. 0.0150 = 1.5% monthly
    term_months = Column(Integer, nullable=False)
    monthly_payment = Column(Numeric(15, 2), nullable=False)

    status = Column(Enum(LoanStatus), default=LoanStatus.ACTIVE, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="loans")
    application = relationship("LoanApplication", backref="loan")
