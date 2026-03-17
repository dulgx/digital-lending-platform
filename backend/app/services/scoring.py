"""
Credit Scoring Engine — Rule-Based (MVP)

Inputs:
  salary       : monthly salary (MNT or any currency)
  loan_amount  : requested loan amount
  age          : borrower age

Score breakdown (max 100):
  Debt-to-Income ratio (salary / loan_amount)  → 0–40 pts
  Age factor                                    → 0–30 pts
  Loan amount tier                              → 0–30 pts

Thresholds:
  >= 70 → APPROVE
  50-69 → REVIEW
  < 50  → REJECT
"""

from dataclasses import dataclass


@dataclass
class ScoreResult:
    score: int
    breakdown: dict[str, int]


def calculate_score(salary: float, loan_amount: float, age: int) -> ScoreResult:
    breakdown: dict[str, int] = {}

    # 1. Debt-to-Income (salary coverage ratio)
    if loan_amount <= 0:
        raise ValueError("Loan amount must be greater than 0")

    ratio = salary / loan_amount
    if ratio >= 3.0:
        dti_score = 40
    elif ratio >= 2.0:
        dti_score = 30
    elif ratio >= 1.0:
        dti_score = 20
    else:
        dti_score = 10
    breakdown["dti"] = dti_score

    # 2. Age factor
    if 25 <= age <= 45:
        age_score = 30
    elif (20 <= age < 25) or (45 < age <= 55):
        age_score = 20
    else:
        age_score = 10
    breakdown["age"] = age_score

    # 3. Loan amount tier (lower = safer)
    if loan_amount <= 5_000_000:
        amount_score = 30
    elif loan_amount <= 15_000_000:
        amount_score = 20
    else:
        amount_score = 10
    breakdown["loan_amount_tier"] = amount_score

    total = dti_score + age_score + amount_score
    return ScoreResult(score=total, breakdown=breakdown)
