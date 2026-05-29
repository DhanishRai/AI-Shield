"""
Fraud Shield — Explainability Module
Generates human-readable explanations for fraud predictions.
"""

from config import SAFE_THRESHOLD, SUSPICIOUS_THRESHOLD


def generate_explanation(
    risk_score: int,
    status: str,
    confidence: float,
    ml_probability: float,
    rule_reasons: list,
    features: dict,
) -> dict:
    """
    Generate a detailed, human-readable explanation of the prediction.

    Returns:
        {
            "summary": str,
            "reasons": list[str],
            "details": dict,
            "advice": str,
        }
    """
    # ── Build Reasons List ─────────────────────────────────
    reasons = list(rule_reasons)  # Start with rule engine reasons

    # Add ML-based insights
    if ml_probability > 0.7:
        reasons.append("ML model detected high fraud probability")
    elif ml_probability > 0.4:
        reasons.append("ML model detected moderate fraud signals")

    # Remove duplicates while preserving order
    seen = set()
    unique_reasons = []
    for r in reasons:
        if r not in seen:
            seen.add(r)
            unique_reasons.append(r)

    # ── Build Summary ──────────────────────────────────────
    if status == "HIGH_RISK":
        summary = (
            f"[WARNING] HIGH RISK - This transaction has a risk score of {risk_score}/100. "
            "We strongly recommend NOT proceeding with this payment."
        )
    elif status == "SUSPICIOUS":
        summary = (
            f"[CAUTION] SUSPICIOUS - This transaction has a risk score of {risk_score}/100. "
            "Proceed with caution and verify the merchant details."
        )
    else:
        summary = (
            f"[OK] SAFE - This transaction has a risk score of {risk_score}/100. "
            "No significant fraud indicators detected."
        )

    # ── Build Advice ───────────────────────────────────────
    advice = _generate_advice(status, features)

    # ── Build Details ──────────────────────────────────────
    details = {
        "risk_score": risk_score,
        "ml_fraud_probability": round(ml_probability, 4),
        "confidence": round(confidence, 4),
        "rules_triggered_count": len(rule_reasons),
        "merchant_name": features.get("raw_merchant_name", "N/A"),
        "upi_id": features.get("raw_upi_id", "N/A"),
        "amount": features.get("amount", 0),
    }

    return {
        "summary": summary,
        "reasons": unique_reasons,
        "details": details,
        "advice": advice,
    }


def _generate_advice(status: str, features: dict) -> str:
    """Generate context-specific advice based on risk level."""
    if status == "HIGH_RISK":
        advices = [
            "Do NOT proceed with this payment.",
            "Report this UPI ID if you suspect fraud.",
            "Verify the merchant through official channels.",
        ]
        if features.get("blacklisted_upi"):
            advices.append(
                "This UPI ID has been flagged - do not send money."
            )
        return " ".join(advices)

    elif status == "SUSPICIOUS":
        return (
            "Double-check the merchant name and UPI ID before paying. "
            "If unsure, contact the merchant directly through a verified number."
        )

    else:
        return "This transaction appears safe. You may proceed."
