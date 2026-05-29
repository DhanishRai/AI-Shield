"""
Fraud Shield — Model Training Script
Trains Random Forest, XGBoost, and Logistic Regression.
Compares metrics and saves the best model.

Usage:
    python train.py
"""

import os
import sys
import time
import warnings
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report,
    roc_auc_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)
from imblearn.over_sampling import SMOTE

from config import MODEL_PATH, SCALER_PATH
from preprocess import load_dataset, prepare_training_data

warnings.filterwarnings("ignore")

# Try importing XGBoost (optional)
try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
    print("[TRAIN] [OK] XGBoost available")
except ImportError:
    HAS_XGBOOST = False
    print("[TRAIN] [X] XGBoost not available - skipping")


def print_header(text):
    print(f"\n{'=' * 60}")
    print(f"  {text}")
    print(f"{'=' * 60}")


def print_metrics(name, y_true, y_pred, y_prob):
    """Print detailed metrics for a model."""
    print(f"\n  -- {name} Results --")
    print(f"  Precision : {precision_score(y_true, y_pred):.4f}")
    print(f"  Recall    : {recall_score(y_true, y_pred):.4f}")
    print(f"  F1-Score  : {f1_score(y_true, y_pred):.4f}")
    print(f"  ROC-AUC   : {roc_auc_score(y_true, y_prob):.4f}")
    print(f"\n  Confusion Matrix:")
    cm = confusion_matrix(y_true, y_pred)
    print(f"    TN={cm[0][0]:>6}  FP={cm[0][1]:>4}")
    print(f"    FN={cm[1][0]:>6}  TP={cm[1][1]:>4}")
    print(f"\n  Classification Report:")
    print(classification_report(y_true, y_pred, target_names=["Legit", "Fraud"]))


def train():
    """Main training pipeline."""
    print_header("FRAUD SHIELD — Model Training Pipeline")

    # ── Step 1: Load Data ──────────────────────────────────
    print_header("Step 1: Loading Dataset")
    df = load_dataset()

    X, y = prepare_training_data(df)
    print(f"[TRAIN] Features: {X.shape[1]}, Samples: {X.shape[0]}")
    print(f"[TRAIN] Fraud: {y.sum()}, Legit: {(y == 0).sum()}")

    # ── Step 2: Train/Test Split ───────────────────────────
    print_header("Step 2: Splitting Data")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"[TRAIN] Train: {X_train.shape[0]}, Test: {X_test.shape[0]}")

    # ── Step 3: Scale Features ─────────────────────────────
    print_header("Step 3: Scaling Features")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("[TRAIN] [OK] StandardScaler fitted and applied")

    # ── Step 4: Handle Class Imbalance with SMOTE ──────────
    print_header("Step 4: Handling Class Imbalance (SMOTE)")
    smote = SMOTE(random_state=42, sampling_strategy=0.5)
    X_train_resampled, y_train_resampled = smote.fit_resample(
        X_train_scaled, y_train
    )
    print(f"[TRAIN] After SMOTE — Fraud: {y_train_resampled.sum()}, "
          f"Legit: {(y_train_resampled == 0).sum()}")

    # ── Step 5: Train Models ───────────────────────────────
    print_header("Step 5: Training Models")

    models = {}
    results = {}

    # --- Logistic Regression ---
    print("\n  [1/3] Training Logistic Regression...")
    t0 = time.time()
    lr = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    lr.fit(X_train_resampled, y_train_resampled)
    lr_time = time.time() - t0
    lr_pred = lr.predict(X_test_scaled)
    lr_prob = lr.predict_proba(X_test_scaled)[:, 1]
    models["Logistic Regression"] = lr
    results["Logistic Regression"] = {
        "f1": f1_score(y_test, lr_pred),
        "auc": roc_auc_score(y_test, lr_prob),
        "time": lr_time,
    }
    print_metrics("Logistic Regression", y_test, lr_pred, lr_prob)
    print(f"  Training Time: {lr_time:.2f}s")

    # --- Random Forest ---
    print("\n  [2/3] Training Random Forest...")
    t0 = time.time()
    rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=10,
        class_weight="balanced_subsample",
        random_state=42,
        n_jobs=-1,
    )
    rf.fit(X_train_resampled, y_train_resampled)
    rf_time = time.time() - t0
    rf_pred = rf.predict(X_test_scaled)
    rf_prob = rf.predict_proba(X_test_scaled)[:, 1]
    models["Random Forest"] = rf
    results["Random Forest"] = {
        "f1": f1_score(y_test, rf_pred),
        "auc": roc_auc_score(y_test, rf_prob),
        "time": rf_time,
    }
    print_metrics("Random Forest", y_test, rf_pred, rf_prob)
    print(f"  Training Time: {rf_time:.2f}s")

    # --- XGBoost (if available) ---
    if HAS_XGBOOST:
        print("\n  [3/3] Training XGBoost...")
        t0 = time.time()
        fraud_ratio = (y_train == 0).sum() / max(y_train.sum(), 1)
        xgb = XGBClassifier(
            n_estimators=150,
            max_depth=8,
            learning_rate=0.1,
            scale_pos_weight=fraud_ratio,
            use_label_encoder=False,
            eval_metric="logloss",
            random_state=42,
            n_jobs=-1,
        )
        xgb.fit(X_train_resampled, y_train_resampled)
        xgb_time = time.time() - t0
        xgb_pred = xgb.predict(X_test_scaled)
        xgb_prob = xgb.predict_proba(X_test_scaled)[:, 1]
        models["XGBoost"] = xgb
        results["XGBoost"] = {
            "f1": f1_score(y_test, xgb_pred),
            "auc": roc_auc_score(y_test, xgb_prob),
            "time": xgb_time,
        }
        print_metrics("XGBoost", y_test, xgb_pred, xgb_prob)
        print(f"  Training Time: {xgb_time:.2f}s")
    else:
        print("\n  [3/3] Skipping XGBoost (not installed)")

    # ── Step 6: Compare & Select Best Model ────────────────
    print_header("Step 6: Model Comparison")
    print(f"\n  {'Model':<25} {'F1-Score':<12} {'ROC-AUC':<12} {'Time':<10}")
    print(f"  {'-' * 55}")

    best_name = None
    best_auc = -1.0

    for name, res in results.items():
        print(f"  {name:<25} {res['f1']:<12.4f} {res['auc']:<12.4f} {res['time']:<10.2f}s")
        if res["auc"] > best_auc:
            best_auc = res["auc"]
            best_name = name

    print(f"\n  * Best Model: {best_name} (ROC-AUC: {best_auc:.4f})")

    # ── Step 7: Save Best Model ────────────────────────────
    print_header("Step 7: Saving Model & Scaler")

    best_model = models[best_name]
    joblib.dump(best_model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    print(f"  [OK] Model saved to: {MODEL_PATH}")
    print(f"  [OK] Scaler saved to: {SCALER_PATH}")
    print(f"  [OK] Model size: {os.path.getsize(MODEL_PATH) / (1024*1024):.2f} MB")

    print_header("Training Complete!")
    print(f"  Best model: {best_name}")
    print(f"  Ready for predictions via Flask API.\n")

    return best_model, scaler


if __name__ == "__main__":
    train()
