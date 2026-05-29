"""
Fraud Shield — Rule Engine
Applies deterministic rules on top of ML predictions.
Each rule adds risk points and a human-readable reason.
"""

from config import (
    RULE_WEIGHTS,
    SUSPICIOUS_KEYWORDS,
    BLACKLISTED_UPI_IDS,
)


def apply_rules(features: dict) -> dict:
    """
    Apply rule-based scoring to extracted features.

    Args:
        features: Dict of extracted features from preprocess.extract_request_features()

    Returns:
        {
            "rule_score": int (0–100+),
            "reasons": list[str],
            "rules_triggered": list[str],
        }
    """
    score = 0
    reasons = []
    rules_triggered = []

    # ── Rule 1: Blacklisted UPI ID → +40 ──────────────────
    if features.get("blacklisted_upi"):
        score += RULE_WEIGHTS["blacklisted_upi"]
        reasons.append("Blacklisted UPI ID detected")
        rules_triggered.append("blacklisted_upi")

    # ── Rule 2: High Report Count (>3) → +25 ──────────────
    if features.get("report_count", 0) > 3:
        score += RULE_WEIGHTS["high_report_count"]
        reasons.append(f"Reported merchant (reported {features['report_count']} times)")
        rules_triggered.append("high_report_count")

    # ── Rule 3: High Amount (>5000) → +15 ─────────────────
    if features.get("amount", 0) > 5000:
        score += RULE_WEIGHTS["high_amount"]
        reasons.append(f"High transaction amount (Rs.{features['amount']:,.0f})")
        rules_triggered.append("high_amount")

    # ── Rule 4: Late Night (12AM–5AM) → +10 ───────────────
    if features.get("late_night"):
        score += RULE_WEIGHTS["late_night"]
        reasons.append("Late night transaction (12AM-5AM)")
        rules_triggered.append("late_night")

    # ── Rule 5: Suspicious Merchant Name → +20 ────────────
    if features.get("suspicious_name"):
        matched_keywords = _get_matched_keywords(
            features.get("raw_merchant_name", "")
        )
        score += RULE_WEIGHTS["suspicious_name"]
        reasons.append(
            f"Suspicious merchant name (matched: {', '.join(matched_keywords)})"
        )
        rules_triggered.append("suspicious_name")

    # ── Bonus: New Payee → +5 ─────────────────────────────
    if features.get("is_new_payee"):
        score += 5
        reasons.append("Unknown/new payee")
        rules_triggered.append("new_payee")

    return {
        "rule_score": min(score, 100),  # Cap at 100
        "reasons": reasons,
        "rules_triggered": rules_triggered,
    }


def _get_matched_keywords(name: str) -> list:
    """Return which suspicious keywords matched the merchant name."""
    name_lower = name.lower()
    return [kw for kw in SUSPICIOUS_KEYWORDS if kw in name_lower]
