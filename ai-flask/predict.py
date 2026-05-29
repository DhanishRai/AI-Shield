"""
Fraud Shield — Prediction Helper
Standalone prediction function for use outside Flask (CLI, testing, etc.)
"""

import json
import sys
from services.fraud_engine import predict_fraud


def predict_from_dict(data: dict) -> dict:
    """Run prediction on a dict of payment data."""
    return predict_fraud(data)


def predict_from_json(json_str: str) -> dict:
    """Run prediction on a JSON string."""
    data = json.loads(json_str)
    return predict_fraud(data)


# ═══════════════════════════════════════════════════════════
#  CLI TEST RUNNER
# ═══════════════════════════════════════════════════════════

def run_test_cases():
    """Run built-in test cases to verify the system."""
    print("=" * 60)
    print("  FRAUD SHIELD - Test Cases")
    print("=" * 60)

    test_cases = [
        {
            "name": "[SAFE] Safe Transaction",
            "expected": "SAFE",
            "data": {
                "amount": 250,
                "merchant_name": "ABC Store",
                "upi_id": "abcstore@upi",
                "report_count": 0,
                "is_new_payee": False,
                "hour": 14,
            },
        },
        {
            "name": "[WARN] Suspicious Transaction",
            "expected": "SUSPICIOUS",
            "data": {
                "amount": 6000,
                "merchant_name": "Quick Pay",
                "upi_id": "quickpay@upi",
                "report_count": 2,
                "is_new_payee": True,
                "hour": 23,
            },
        },
        {
            "name": "[RISK] High Risk Transaction",
            "expected": "HIGH_RISK",
            "data": {
                "amount": 12000,
                "merchant_name": "Refund Center",
                "upi_id": "fakehelp@upi",
                "report_count": 6,
                "is_new_payee": True,
                "hour": 2,
            },
        },
        {
            "name": "[RISK] Prize Scam",
            "expected": "HIGH_RISK",
            "data": {
                "amount": 9999,
                "merchant_name": "Prize Winner Reward",
                "upi_id": "prizeclaim@upi",
                "report_count": 10,
                "is_new_payee": True,
                "hour": 3,
            },
        },
        {
            "name": "[SAFE] Regular Small Payment",
            "expected": "SAFE",
            "data": {
                "amount": 100,
                "merchant_name": "Tea Stall",
                "upi_id": "teastall@upi",
                "report_count": 0,
                "is_new_payee": False,
                "hour": 10,
            },
        },
    ]

    passed = 0
    total = len(test_cases)

    for i, tc in enumerate(test_cases, 1):
        print(f"\n{'-' * 60}")
        print(f"  Test {i}: {tc['name']}")
        print(f"  Expected: {tc['expected']}")
        print(f"{'-' * 60}")

        result = predict_fraud(tc["data"])

        print(f"  Risk Score : {result['risk_score']}")
        print(f"  Status     : {result['status']}")
        print(f"  Confidence : {result['confidence']}")
        print(f"  Reasons    : {result['reasons']}")

        status_ok = result["status"] == tc["expected"]
        if status_ok:
            print(f"  Result     : PASS")
            passed += 1
        else:
            print(f"  Result     : FAIL (got {result['status']})")

    print(f"\n{'=' * 60}")
    print(f"  Results: {passed}/{total} tests passed")
    print(f"{'=' * 60}\n")


if __name__ == "__main__":
    run_test_cases()
