"""
Fraud Shield — Data Preprocessing
Handles loading, cleaning, and feature engineering for the credit card dataset.
Also provides feature extraction for incoming QR/UPI payment requests.
"""

import pandas as pd
import numpy as np
from config import DATASET_PATH, SUSPICIOUS_KEYWORDS, BLACKLISTED_UPI_IDS


# ═══════════════════════════════════════════════════════════
#  TRAINING DATA PREPROCESSING
# ═══════════════════════════════════════════════════════════

def load_dataset(path=None):
    """Load the credit card fraud dataset."""
    path = path or DATASET_PATH
    print(f"[PREPROCESS] Loading dataset from: {path}")
    df = pd.read_csv(path)
    print(f"[PREPROCESS] Dataset shape: {df.shape}")
    print(f"[PREPROCESS] Fraud ratio: {df['Class'].mean():.4%}")
    return df


def prepare_training_data(df):
    """
    Split features and labels from the credit card dataset.
    Returns X (features) and y (labels).
    """
    X = df.drop(columns=["Class"])
    y = df["Class"]
    return X, y


# ═══════════════════════════════════════════════════════════
#  REQUEST FEATURE EXTRACTION (QR/UPI Payment Data)
# ═══════════════════════════════════════════════════════════

def extract_request_features(data: dict) -> dict:
    """
    Convert incoming API request data into features for both
    the ML model and the rule engine.

    Input:
        {
            "amount": 9000,
            "merchant_name": "Refund Center",
            "upi_id": "fakehelp@upi",
            "report_count": 4,
            "is_new_payee": true,
            "hour": 1
        }

    Returns a dict of engineered features.
    """
    amount = float(data.get("amount", 0))
    merchant_name = str(data.get("merchant_name", "")).strip()
    upi_id = str(data.get("upi_id", "")).strip().lower()
    report_count = int(data.get("report_count", 0))
    is_new_payee = bool(data.get("is_new_payee", False))
    hour = int(data.get("hour", 12))

    # ── Derived Features ──────────────────────────────────
    suspicious_name = _check_suspicious_name(merchant_name)
    blacklisted_upi = upi_id in BLACKLISTED_UPI_IDS
    late_night = 0 <= hour <= 5
    merchant_name_score = _compute_merchant_name_score(merchant_name)

    features = {
        "amount": amount,
        "report_count": report_count,
        "is_new_payee": int(is_new_payee),
        "suspicious_name": int(suspicious_name),
        "blacklisted_upi": int(blacklisted_upi),
        "late_night": int(late_night),
        "merchant_name_score": merchant_name_score,
        "hour": hour,
        # Original values for rule engine / explanation
        "raw_merchant_name": merchant_name,
        "raw_upi_id": upi_id,
    }

    return features


def _check_suspicious_name(name: str) -> bool:
    """Check if merchant name contains any suspicious keywords."""
    name_lower = name.lower()
    return any(keyword in name_lower for keyword in SUSPICIOUS_KEYWORDS)


def _compute_merchant_name_score(name: str) -> float:
    """
    Compute a suspicion score for the merchant name (0.0 – 1.0).
    More matching keywords = higher score.
    """
    if not name:
        return 0.0
    name_lower = name.lower()
    matches = sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in name_lower)
    # Normalize: max score if 3+ keywords match
    return min(matches / 3.0, 1.0)


def build_model_input(features: dict) -> np.ndarray:
    """
    Build a feature vector compatible with the trained ML model.

    The credit card dataset has 30 features (V1–V28, Time, Amount).
    We map our QR/UPI features into a synthetic 30-feature vector
    so the model can produce a probability estimate.
    """
    # Create a 30-dimensional feature vector (matching credit card dataset)
    vector = np.zeros(30)

    # Map our custom features into strategic positions:
    # Amount → maps to the 'Amount' column (index 29)
    vector[29] = features["amount"]

    # Time-like feature (index 0) — hour normalized
    vector[0] = features["hour"] / 24.0

    # Report count → high-signal feature (index 1)
    vector[1] = features["report_count"] * 5.0

    # Is new payee → indicator (index 2)
    vector[2] = features["is_new_payee"] * 3.0

    # Suspicious name → strong signal (index 3)
    vector[3] = features["suspicious_name"] * 8.0

    # Blacklisted UPI → strongest signal (index 4)
    vector[4] = features["blacklisted_upi"] * 10.0

    # Late night → moderate signal (index 5)
    vector[5] = features["late_night"] * 4.0

    # Merchant name score → weighted (index 6)
    vector[6] = features["merchant_name_score"] * 6.0

    return vector.reshape(1, -1)
