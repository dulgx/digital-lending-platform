"""
Credit Scoring Engine V2

Inputs:
  salary       : monthly salary (MNT or any currency)
  loan_amount  : requested loan amount
  term_months  : loan duration
  age          : borrower age

Score breakdown (max 100):
  Debt-to-Income DTI (stressed payment / salary) -> 0–40 pts
  Age factor                                     -> 0–30 pts
  Loan amount tier                               -> 0–30 pts

Risk Bands:
  Score >= 80: Band A (1.0% per month)
  Score >= 70: Band B (1.5% per month)
  Score >= 60: Band C (2.0% per month)
  Score >= 50: Band D (2.5% per month)
  Score < 50 : Reject
"""

from dataclasses import dataclass
from decimal import Decimal
from app.services.decision import calculate_monthly_payment

@dataclass
class ScoreResult:
    score: int
    breakdown: dict[str, int]
    risk_band: str
    interest_rate: Decimal

def calculate_score(salary: float, loan_amount: float, term_months: int, age: int) -> ScoreResult:
    breakdown: dict[str, int] = {}

    if loan_amount <= 0:
        raise ValueError("Loan amount must be greater than 0")

    # Step 1: Stress Test DTI using max rate 2.5%
    stress_rate = Decimal("0.025")
    monthly_payment = float(calculate_monthly_payment(Decimal(loan_amount), stress_rate, term_months))
    
    dti = monthly_payment / salary if salary > 0 else 1.0
    
    if dti <= 0.20:
        dti_score = 40
    elif dti <= 0.35:
        dti_score = 30
    elif dti <= 0.50:
        dti_score = 20
    else:
        dti_score = 0
    breakdown["dti"] = dti_score

    # Step 2: Age factor
    if 25 <= age <= 45:
        age_score = 30
    elif (20 <= age < 25) or (45 < age <= 55):
        age_score = 20
    else:
        age_score = 10
    breakdown["age"] = age_score

    # Step 3: Loan amount tier (lower = safer)
    if loan_amount <= 5_000_000:
        amount_score = 30
    elif loan_amount <= 15_000_000:
        amount_score = 20
    else:
        amount_score = 10
    breakdown["loan_amount_tier"] = amount_score

    total = dti_score + age_score + amount_score
    
    # Step 4: Determine Risk Band and Rate
    if total >= 80:
        band = "A"
        rate = Decimal("0.010") # 1.0%
    elif total >= 70:
        band = "B"
        rate = Decimal("0.015") # 1.5%
    elif total >= 60:
        band = "C"
        rate = Decimal("0.020") # 2.0%
    elif total >= 50:
        band = "D"
        rate = Decimal("0.025") # 2.5%
    else:
        band = "F"
        rate = Decimal("0.030") # 3.0% (Rejected)

    return ScoreResult(score=total, breakdown=breakdown, risk_band=band, interest_rate=rate)
