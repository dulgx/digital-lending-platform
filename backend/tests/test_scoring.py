"""
Tests for the credit scoring engine and decision logic V2.
Run with: pytest tests/test_scoring.py -v
"""

import pytest
from app.services.scoring import calculate_score, ScoreResult
from app.services.decision import get_decision, calculate_monthly_payment, generate_repayment_schedule
from app.models.loan_application import ApplicationStatus
from decimal import Decimal


# ─────────────────────────────────────────
# calculate_score — return type
# ─────────────────────────────────────────

def test_returns_score_result():
    result = calculate_score(salary=3_000_000, loan_amount=1_000_000, term_months=12, age=30)
    assert isinstance(result, ScoreResult)
    assert isinstance(result.score, int)
    assert isinstance(result.breakdown, dict)


# ─────────────────────────────────────────
# Score range
# ─────────────────────────────────────────

def test_score_is_between_0_and_100():
    result = calculate_score(salary=1_000_000, loan_amount=1_000_000, term_months=12, age=30)
    assert 0 <= result.score <= 100


def test_score_max_possible():
    # Best case: salary >> loan, ideal age, small loan
    # DTI ~0 < 0.20 (40), Age 30 (30), Amount 1M (30) => 100
    result = calculate_score(salary=10_000_000, loan_amount=1_000_000, term_months=12, age=30)
    assert result.score == 100  # 40 + 30 + 30


def test_score_min_possible():
    # Worst case: salary << loan payment (DTI > 0.50 => 0), edge age (10), huge loan (10) => 20
    result = calculate_score(salary=100_000, loan_amount=50_000_000, term_months=12, age=18)
    assert result.score == 20  # 0 + 10 + 10


# ─────────────────────────────────────────
# Zero loan amount — should raise error
# ─────────────────────────────────────────

def test_zero_loan_amount_raises():
    with pytest.raises(ValueError):
        calculate_score(salary=1_000_000, loan_amount=0, term_months=12, age=30)


# ─────────────────────────────────────────
# get_decision — thresholds
# ─────────────────────────────────────────

def test_score_60_and_above_is_approved():
    assert get_decision(60) == ApplicationStatus.APPROVED
    assert get_decision(100) == ApplicationStatus.APPROVED

def test_score_50_to_59_is_review():
    assert get_decision(50) == ApplicationStatus.REVIEW
    assert get_decision(59) == ApplicationStatus.REVIEW

def test_score_below_50_is_rejected():
    assert get_decision(49) == ApplicationStatus.REJECTED
    assert get_decision(0) == ApplicationStatus.REJECTED


# ─────────────────────────────────────────
# Full flow: score → decision
# ─────────────────────────────────────────

def test_strong_profile_gets_approved():
    # salary=3M, loan=1M, term=12, age=30 → score=100
    result = calculate_score(salary=3_000_000, loan_amount=1_000_000, term_months=12, age=30)
    decision = get_decision(result.score)
    assert decision == ApplicationStatus.APPROVED

def test_weak_profile_gets_rejected():
    # salary=100K, loan=20M, term=12, age=18 → score=20
    result = calculate_score(salary=100_000, loan_amount=20_000_000, term_months=12, age=18)
    decision = get_decision(result.score)
    assert decision == ApplicationStatus.REJECTED


# ─────────────────────────────────────────
# calculate_monthly_payment
# ─────────────────────────────────────────

def test_monthly_payment_is_positive():
    payment = calculate_monthly_payment(
        principal=Decimal("1_000_000"),
        monthly_rate=Decimal("0.015"),
        term_months=12,
    )
    assert payment > 0

def test_zero_interest_divides_evenly():
    payment = calculate_monthly_payment(
        principal=Decimal("1_200_000"),
        monthly_rate=Decimal("0"),
        term_months=12,
    )
    assert payment == Decimal("100_000.00")

# ─────────────────────────────────────────
# generate_repayment_schedule
# ─────────────────────────────────────────

def test_schedule_has_correct_count():
    schedule = generate_repayment_schedule(
        loan_id=1,
        principal=Decimal("1_000_000"),
        term_months=12,
        monthly_payment=Decimal("91_680"),
    )
    assert len(schedule) == 12

def test_schedule_all_pending():
    schedule = generate_repayment_schedule(
        loan_id=1,
        principal=Decimal("1_000_000"),
        term_months=3,
        monthly_payment=Decimal("91_680"),
    )
    assert all(s["status"] == "pending" for s in schedule)
