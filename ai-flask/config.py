"""
Fraud Shield — Configuration
Central config for paths, thresholds, and constants.
"""

import os

# ─── Paths ───────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")
DATASET_PATH = os.path.join(DATA_DIR, "creditcard.csv")

# ─── Risk Thresholds ────────────────────────────────────
SAFE_THRESHOLD = 30
SUSPICIOUS_THRESHOLD = 70

# ─── Rule Engine Weights ────────────────────────────────
RULE_WEIGHTS = {
    "blacklisted_upi": 40,
    "high_report_count": 25,
    "high_amount": 15,
    "late_night": 10,
    "suspicious_name": 20,
}

# ─── Suspicious Merchant Keywords ───────────────────────
SUSPICIOUS_KEYWORDS = [
    "refund", "support", "prize", "reward", "helpline",
    "lottery", "winner", "claim", "cashback", "offer",
]

# ─── Blacklisted UPI IDs ────────────────────────────────
BLACKLISTED_UPI_IDS = [
    "fakehelp@upi",
    "fraudpay@upi",
    "scamrefund@upi",
    "prizeclaim@upi",
    "lotterywin@upi",
    "support123@upi",
    "helpdesk99@upi",
]

# ─── Model Blend Weights ────────────────────────────────
# How much ML vs Rule Engine contributes to final score
ML_WEIGHT = 0.30       # 30% from ML model
RULE_WEIGHT = 0.70     # 70% from rule engine

# ─── Flask Config ────────────────────────────────────────
FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000
FLASK_DEBUG = True
