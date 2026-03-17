from datetime import datetime, timezone

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Integer, Numeric
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class RepaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    OVERDUE = "overdue"


class Repayment(Base):
    __tablename__ = "repayments"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"), nullable=False)

    installment_number = Column(Integer, nullable=False)  # 1..n
    due_date = Column(Date, nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    paid_at = Column(DateTime, nullable=True)

    status = Column(Enum(RepaymentStatus), default=RepaymentStatus.PENDING, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    loan = relationship("Loan", backref="repayments")
