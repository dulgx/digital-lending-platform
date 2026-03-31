from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Numeric, String, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    REVIEW = "review"


class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    amount = Column(Numeric(15, 2), nullable=False)
    term_months = Column(Integer, nullable=False)

    # Scoring result
    score = Column(Integer, nullable=True)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING, nullable=False)
    admin_note = Column(String, nullable=True)

    # B2B fields
    is_b2b = Column(Boolean, default=False, nullable=False)
    # Storing arbitrary data for partners (like the customer's name, age, transactions)
    customer_data = Column(JSONB, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="applications")
