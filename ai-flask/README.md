# 🛡️ Fraud Shield — AI Fraud Detection Module

> **Scan Before You Pay** — ML-powered fraud detection for QR/UPI payments.

## 🏗️ Project Structure

```
ai-flask/
├── app.py                  # Flask entry point
├── config.py               # Central configuration
├── train.py                # ML training pipeline
├── predict.py              # CLI prediction + test cases
├── preprocess.py           # Feature extraction & data loading
├── requirements.txt        # Python dependencies
├── model.pkl               # Trained model (after training)
├── scaler.pkl              # Feature scaler (after training)
│
├── routes/
│   └── predict_route.py    # POST /predict API endpoint
│
├── services/
│   ├── fraud_engine.py     # Core: ML + Rules hybrid engine
│   ├── rule_engine.py      # Deterministic rule scoring
│   └── explain.py          # Human-readable explanations
│
├── data/
│   └── creditcard.csv      # Kaggle dataset (download separately)
│
└── notebooks/
    └── (experimentation)
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Download Dataset (for training)
Download from: https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud  
Place `creditcard.csv` in the `data/` folder.

### 3. Train the Model
```bash
python train.py
```

### 4. Start the API Server
```bash
python app.py
```
Server runs at: `http://localhost:5000`

### 5. Test with curl
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"amount": 9000, "merchant_name": "Refund Center", "upi_id": "fakehelp@upi", "report_count": 4, "is_new_payee": true, "hour": 1}'
```

## 📡 API Endpoints

| Method | Endpoint   | Description                    |
|--------|-----------|--------------------------------|
| GET    | /         | Service info                   |
| GET    | /health   | Health check + model status    |
| POST   | /predict  | Fraud risk prediction          |
| GET    | /predict  | API usage documentation        |

## ⚡ Works Without Training!

The API works **immediately** in **rules-only mode** — no dataset needed.  
After training, it switches to **ML + Rules hybrid mode** for better accuracy.

## 🧪 Run Test Cases
```bash
python predict.py
```
