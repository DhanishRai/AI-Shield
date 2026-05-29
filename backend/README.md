# Fraud Shield Backend Setup & API Guide

## Tech Stack
- **Node.js & Express:** Main API handling scans, user authentication, and reporting.
- **Python Flask:** AI microservice evaluating fraud rules dynamically.
- **MongoDB:** Database for History, Users, and Blacklist.

## Prerequisites
- Node.js installed
- Python 3+ installed
- MongoDB running locally on port `27017`

## Setup Instructions

### 1. Start Python AI Microservice
Open a terminal.
```bash
cd ai-flask
# Create virtual environment if you haven't
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
*Runs on port 5001.*

### 2. Start Node.js Backend
Open a second terminal.
```bash
cd backend
npm install
npm run dev
```
*Runs on port 5000.*

### 3. Seed Database (Optional)
Populate the MongoDB with a test user and a mock blacklist of scammers to test the risk engine instantly.
```bash
cd backend
node scripts/seed.js
```

### 4. Run Automated Scenarios
Watch the AI engine flag different transactions in real-time to verify everything is working.
```bash
cd backend
node scripts/test_scenarios.js
```

## Postman Collection
Import the `Fraud_Shield_Postman_Collection.json` file found in the backend folder directly into Postman to manually test:
1. `Login`
2. `Safe Scan`
3. `Suspicious Scan`
4. `Dangerous Scan`
5. `Report Suspicious QR`
6. `View History`
