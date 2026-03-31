from decimal import Decimal
from typing import List
from app.schemas.b2b import OpenBankingTransaction


def analyze_transactions(transactions: List[OpenBankingTransaction]) -> dict:
    """
    Analyzes Open Banking transactions to derive a 'Smart Score' (-50 to +50 impact).
    Returns a dict with 'smart_score' impact and 'reasons'.
    """
    if not transactions:
        return {"smart_score": 0, "reasons": ["No transaction data provided"]}

    score_impact = 0
    reasons = []

    # Simple logic
    gambling_count = 0
    salary_count = 0
    savings_count = 0

    for tx in transactions:
        cat = tx.category.upper()
        if "GAMBLING" in cat or "BET" in cat:
            gambling_count += 1
        elif "SALARY" in cat or "INCOME" in cat:
            salary_count += 1
        elif "SAVING" in cat or "INVESTMENT" in cat:
            savings_count += 1

    # Apply rules
    if gambling_count > 0:
        penalty = min(gambling_count * 10, 40)
        score_impact -= penalty
        reasons.append(f"Gambling activity detected (-{penalty} pts)")

    if salary_count >= 3: # E.g., consistent over 3 months
        score_impact += 20
        reasons.append("Consistent salary income (+20 pts)")
    elif salary_count > 0:
        score_impact += 10
        reasons.append("Some salary income (+10 pts)")

    if savings_count > 0:
        score_impact += 10
        reasons.append("Savings or investing activity (+10 pts)")

    return {
        "smart_score": score_impact,
        "reasons": reasons
    }
