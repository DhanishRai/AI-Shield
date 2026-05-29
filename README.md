# Fraud Shield - Scan Before You Pay

A mobile fraud-prevention app that scans QR codes before users make UPI payments, powered by AI/ML threat detection.

## Architecture

```
User opens app
  -> Scan QR code
  -> QR parsed (upi_id, merchant_name, amount)
  -> React Native sends data to Node.js backend (POST /api/scan)
  -> Node.js forwards to Flask AI (POST /predict)
  -> Flask ML model + Rule Engine returns fraud assessment
  -> Node.js saves history to MongoDB + returns response
  -> App shows SAFE / SUSPICIOUS / HIGH_RISK
  -> If SAFE -> user can open Google Pay / PhonePe / Paytm
```

## Project Structure

```
Fraud-shield/
├── mobile-app/          # React Native (Expo) frontend
│   ├── src/
│   │   ├── screens/     # All app screens
│   │   ├── components/  # Reusable UI components
│   │   ├── services/    # API, deep links, storage
│   │   ├── modules/     # QR scanner/parser
│   │   └── navigation/  # Stack navigator
│   ├── App.js
│   └── package.json
│
├── backend/             # Node.js + Express backend
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # MongoDB schemas
│   │   ├── services/    # Flask integration, blacklist
│   │   ├── middleware/   # Auth, error handling, logging
│   │   ├── config/      # DB, environment config
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── ai-flask/            # Python Flask AI/ML engine
│   ├── app.py           # Flask server
│   ├── train.py         # ML model training pipeline
│   ├── config.py        # Thresholds & weights
│   ├── preprocess.py    # Feature engineering
│   ├── routes/          # /predict endpoint
│   ├── services/        # Fraud engine, rule engine, explainer
│   ├── model.pkl        # Trained Random Forest model
│   └── requirements.txt
│
└── README.md
```

## Quick Start

### 1. Start Flask AI Engine (Port 5000)
```bash
cd ai-flask
pip install -r requirements.txt
python app.py
```

### 2. Start Node.js Backend (Port 3000)
```bash
cd backend
npm install
npm run dev
```
> Requires MongoDB running locally on port 27017

### 3. Start Mobile App
```bash
cd mobile-app
npm install
npx expo start
```

## API Endpoints

### Node.js Backend (Port 3000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login/Register user |
| POST | `/api/scan` | Scan QR + AI analysis |
| GET | `/api/history/:userId` | Get scan history |
| POST | `/api/report` | Report suspicious UPI |
| GET | `/health` | Health check |

### Flask AI (Port 5000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | AI fraud prediction |
| GET | `/health` | Health check |

## Scan Request/Response

### Request (POST /api/scan)
```json
{
  "upiId": "fakehelp@upi",
  "merchantName": "Refund Center",
  "amount": 9000
}
```

### Response
```json
{
  "risk_score": 97,
  "status": "HIGH_RISK",
  "confidence": 0.99,
  "reasons": [
    "Blacklisted UPI ID detected",
    "High transaction amount",
    "Suspicious merchant name"
  ],
  "historyId": "..."
}
```

## AI/ML Details

- **Model**: Random Forest (98.57% ROC-AUC)
- **Training Data**: Kaggle Credit Card Fraud Dataset (SMOTE balanced)
- **Hybrid Approach**: 30% ML + 70% Rule Engine (optimized for QR/UPI fraud)
- **Rule Engine**: Blacklisted UPI, report count, amount threshold, late-night, suspicious keywords, new payee

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native + Expo |
| Backend | Node.js + Express |
| Database | MongoDB |
| AI/ML | Python + Flask + scikit-learn |
| ML Model | Random Forest |

## Team

- **Member 1**: React Native UI Screens
- **Member 2**: QR Scanner + UPI Deep Links
- **Member 3**: Node.js Backend + MongoDB
- **Member 4**: AI/ML Fraud Detection Engine