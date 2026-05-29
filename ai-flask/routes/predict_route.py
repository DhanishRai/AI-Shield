"""
Fraud Shield — Predict API Route
POST /predict endpoint for real-time fraud detection.
"""

import time
from flask import Blueprint, request, jsonify
from services.fraud_engine import predict_fraud

# Create Blueprint
predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/predict", methods=["POST"])
def predict():
    """
    Predict fraud risk for a QR/UPI payment.

    POST /predict
    Content-Type: application/json

    Request Body:
        {
            "amount": 9000,
            "merchant_name": "Refund Center",
            "upi_id": "fakehelp@upi",
            "report_count": 4,
            "is_new_payee": true,
            "hour": 1
        }

    Response:
        {
            "risk_score": 89,
            "status": "HIGH_RISK",
            "confidence": 0.93,
            "reasons": [...],
            "explanation": {...},
            "response_time_ms": 12
        }
    """
    start_time = time.time()

    # ── Validate Request ───────────────────────────────────
    if not request.is_json:
        return jsonify({
            "error": "Content-Type must be application/json",
            "status": "ERROR",
        }), 400

    data = request.get_json()

    # Validate required fields
    required_fields = ["amount"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({
            "error": f"Missing required fields: {', '.join(missing)}",
            "status": "ERROR",
        }), 400

    # Validate amount is positive
    try:
        amount = float(data.get("amount", 0))
        if amount < 0:
            return jsonify({
                "error": "Amount must be non-negative",
                "status": "ERROR",
            }), 400
    except (ValueError, TypeError):
        return jsonify({
            "error": "Amount must be a valid number",
            "status": "ERROR",
        }), 400

    # ── Run Prediction ─────────────────────────────────────
    try:
        result = predict_fraud(data)
    except Exception as e:
        return jsonify({
            "error": f"Prediction failed: {str(e)}",
            "status": "ERROR",
        }), 500

    # ── Add Response Metadata ──────────────────────────────
    elapsed_ms = round((time.time() - start_time) * 1000, 2)
    result["response_time_ms"] = elapsed_ms

    return jsonify(result), 200


@predict_bp.route("/predict", methods=["GET"])
def predict_info():
    """GET /predict — Return API usage info."""
    return jsonify({
        "endpoint": "POST /predict",
        "description": "Predict fraud risk for QR/UPI payments",
        "required_fields": {
            "amount": "float — Transaction amount in INR",
        },
        "optional_fields": {
            "merchant_name": "string — Name of the merchant",
            "upi_id": "string — UPI ID of the payee",
            "report_count": "int — Times this merchant has been reported",
            "is_new_payee": "bool — First time paying this merchant",
            "hour": "int (0-23) — Hour of transaction",
        },
        "example_request": {
            "amount": 9000,
            "merchant_name": "Refund Center",
            "upi_id": "fakehelp@upi",
            "report_count": 4,
            "is_new_payee": True,
            "hour": 1,
        },
    }), 200
