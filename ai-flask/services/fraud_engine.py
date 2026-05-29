"""
Fraud Shield — Fraud Engine (Core Orchestrator)
Combines ML model prediction + Rule Engine into a final risk assessment.
"""

import os
import warnings
import numpy as np
import joblib

warnings.filterwarnings("ignore", category=UserWarning)

from config import (
    MODEL_PATH,
    SCALER_PATH,
    ML_WEIGHT,
    RULE_WEIGHT,
    SAFE_THRESHOLD,
    SUSPICIOUS_THRESHOLD,
)
from preprocess import extract_request_features, build_model_input
from services.rule_engine import apply_rules
from services.explain import generate_explanation


# ═══════════════════════════════════════════════════════════
#  MODEL LOADING (Singleton)
# ═══════════════════════════════════════════════════════════

_model = None
_scaler = None


def _load_model():
    """Load the trained model and scaler (lazy singleton)."""
    global _model, _scaler

    if _model is not None:
        return

    if not os.path.exists(MODEL_PATH):
        print(f"[FRAUD ENGINE] [WARN] Model not found at {MODEL_PATH}")
        print("[FRAUD ENGINE] Using rule-engine-only mode.")
        return

    print(f"[FRAUD ENGINE] Loading model from {MODEL_PATH}...")
    _model = joblib.load(MODEL_PATH)
    print(f"[FRAUD ENGINE] [OK] Model loaded: {type(_model).__name__}")

    if os.path.exists(SCALER_PATH):
        _scaler = joblib.load(SCALER_PATH)
        print("[FRAUD ENGINE] [OK] Scaler loaded")


def get_model():
    """Get the loaded model (loads on first call)."""
    _load_model()
    return _model


def get_scaler():
    """Get the loaded scaler (loads on first call)."""
    _load_model()
    return _scaler


# ═══════════════════════════════════════════════════════════
#  PREDICTION PIPELINE
# ═══════════════════════════════════════════════════════════

def predict_fraud(data: dict) -> dict:
    """
    Full fraud prediction pipeline.

    1. Extract features from request
    2. Run ML model (if available)
    3. Run Rule Engine
    4. Combine scores
    5. Generate explanation

    Args:
        data: Raw request JSON with amount, merchant_name, upi_id, etc.

    Returns:
        {
            "risk_score": int,
            "status": str,
            "confidence": float,
            "reasons": list[str],
            "explanation": dict,
        }
    """
    # ── Step 1: Extract Features ───────────────────────────
    features = extract_request_features(data)

    # ── Step 2: ML Prediction ──────────────────────────────
    ml_probability = _get_ml_probability(features)

    # ── Step 3: Rule Engine ────────────────────────────────
    rule_result = apply_rules(features)
    rule_score = rule_result["rule_score"]
    rule_reasons = rule_result["reasons"]

    # ── Step 4: Combine Scores ─────────────────────────────
    # ML probability (0–1) → scale to 0–100
    ml_score = ml_probability * 100

    # Weighted combination
    combined_score = (ml_score * ML_WEIGHT) + (rule_score * RULE_WEIGHT)

    # Clamp to 0–100
    risk_score = int(min(max(combined_score, 0), 100))

    # ── Step 5: Determine Status ───────────────────────────
    status = _get_status(risk_score)

    # ── Step 6: Calculate Confidence ───────────────────────
    confidence = _calculate_confidence(ml_probability, rule_result)

    # ── Step 7: Generate Explanation ───────────────────────
    explanation = generate_explanation(
        risk_score=risk_score,
        status=status,
        confidence=confidence,
        ml_probability=ml_probability,
        rule_reasons=rule_reasons,
        features=features,
    )

    return {
        "risk_score": risk_score,
        "status": status,
        "confidence": round(confidence, 2),
        "reasons": explanation["reasons"],
        "explanation": explanation,
    }


def _get_ml_probability(features: dict) -> float:
    """
    Get fraud probability from the ML model.
    Falls back to a heuristic if no model is loaded.
    Blends ML output with heuristic to compensate for
    domain mismatch (credit card model vs QR/UPI features).
    """
    model = get_model()
    scaler = get_scaler()

    heuristic_prob = _heuristic_probability(features)

    if model is None:
        # Fallback: rule-engine-only mode
        return heuristic_prob

    # Build model input vector
    model_input = build_model_input(features)

    # Scale if scaler is available
    if scaler is not None:
        model_input = scaler.transform(model_input)

    # Predict probability
    try:
        ml_prob = float(model.predict_proba(model_input)[0][1])
    except Exception as e:
        print(f"[FRAUD ENGINE] ML prediction error: {e}")
        return heuristic_prob

    # Blend: take the max of ML and heuristic to avoid
    # the credit card model suppressing obvious QR fraud
    blended = max(ml_prob, heuristic_prob)
    return blended


def _heuristic_probability(features: dict) -> float:
    """
    Fallback heuristic when no ML model is available.
    Generates a reasonable probability from features alone.
    """
    score = 0.0

    if features.get("blacklisted_upi"):
        score += 0.35
    if features.get("suspicious_name"):
        score += 0.20
    if features.get("report_count", 0) > 3:
        score += 0.15
    if features.get("amount", 0) > 5000:
        score += 0.10
    if features.get("late_night"):
        score += 0.08
    if features.get("is_new_payee"):
        score += 0.05

    return min(score, 1.0)


def _get_status(risk_score: int) -> str:
    """Map risk score to status label."""
    if risk_score <= SAFE_THRESHOLD:
        return "SAFE"
    elif risk_score <= SUSPICIOUS_THRESHOLD:
        return "SUSPICIOUS"
    else:
        return "HIGH_RISK"


def _calculate_confidence(ml_probability: float, rule_result: dict) -> float:
    """
    Calculate confidence in the prediction.
    Higher when ML and rules agree.
    """
    rule_score_normalized = rule_result["rule_score"] / 100.0
    rules_triggered = len(rule_result["rules_triggered"])

    # Both ML and rules agree on fraud
    if ml_probability > 0.5 and rule_score_normalized > 0.5:
        base_confidence = 0.85
    # Both agree on safe
    elif ml_probability < 0.3 and rule_score_normalized < 0.3:
        base_confidence = 0.80
    # They disagree — lower confidence
    else:
        base_confidence = 0.60

    # Boost confidence with more rules triggered
    rule_boost = min(rules_triggered * 0.03, 0.15)

    return min(base_confidence + rule_boost, 0.99)
