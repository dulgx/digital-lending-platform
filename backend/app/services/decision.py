"""
Decision Engine

Evaluates a credit score and applies thresholds to produce a final lending decision.
Also contains repayment schedule generation using the standard annuity formula.
"""

from datetime import date
from dateutil.relativedelta import relativedelta
from decimal import Decimal, ROUND_HALF_UP

from app.models.loan_application import ApplicationStatus

APPROVE_THRESHOLD = 60 # C band and above
REVIEW_THRESHOLD = 50  # D band requires review

# Fallback default interest rate if dynamic is unavailable
DEFAULT_MONTHLY_INTEREST_RATE = Decimal("0.015")


def get_decision(score: int) -> ApplicationStatus:
    """Return approve / review / reject based on score thresholds."""
    if score >= APPROVE_THRESHOLD:
        return ApplicationStatus.APPROVED
    elif score >= REVIEW_THRESHOLD:
        return ApplicationStatus.REVIEW
    else:
        return ApplicationStatus.REJECTED


def calculate_monthly_payment(
    principal: Decimal,
    monthly_rate: Decimal,
    term_months: int,
) -> Decimal:
    """
    Standard annuity formula:
        M = P * r * (1 + r)^n / ((1 + r)^n - 1)
    """
    if monthly_rate == 0:
        return (principal / term_months).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    r = monthly_rate
    n = term_months
    factor = (1 + r) ** n
    payment = principal * r * factor / (factor - 1)
    return payment.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def generate_repayment_schedule(
    loan_id: int,
    principal: Decimal,
    term_months: int,
    monthly_payment: Decimal,
    monthly_rate: Decimal | None = None,
    start_date: date | None = None,
) -> list[dict]:
    """
    Returns a list of repayment installment dicts with amortization breakdown.
    Each installment includes principal_payment, interest_payment, and balance_remaining.
    """
    if start_date is None:
        start_date = date.today()
    if monthly_rate is None:
        monthly_rate = DEFAULT_MONTHLY_INTEREST_RATE

    schedule = []
    balance = principal
    for i in range(1, term_months + 1):
        due = start_date + relativedelta(months=i)
        interest = (balance * monthly_rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        # On the last installment, pay the exact remaining balance to avoid rounding drift
        if i == term_months:
            principal_part = balance
            total = (principal_part + interest).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        else:
            principal_part = (monthly_payment - interest).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            total = monthly_payment
        balance = (balance - principal_part).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        schedule.append(
            {
                "loan_id": loan_id,
                "installment_number": i,
                "due_date": due,
                "amount": total,
                "principal_payment": principal_part,
                "interest_payment": interest,
                "balance_remaining": max(balance, Decimal("0.00")),
                "status": "pending",
            }
        )
    return schedule
