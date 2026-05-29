"""
Fraud Shield — Flask Application
Main entry point for the AI fraud detection API.

Usage:
    python app.py
"""

from flask import Flask, jsonify
from flask_cors import CORS
from routes.predict_route import predict_bp
from config import FLASK_HOST, FLASK_PORT, FLASK_DEBUG


def create_app():
    """Application factory."""
    app = Flask(__name__)

    # ── Enable CORS (for React Native / Node.js backend) ──
    CORS(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    })

    # ── Register Blueprints ────────────────────────────────
    app.register_blueprint(predict_bp)

    # ── Health Check ───────────────────────────────────────
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "service": "Fraud Shield AI",
            "version": "1.0.0",
            "status": "running",
            "endpoints": {
                "POST /predict": "Predict fraud risk for QR/UPI payments",
                "GET /predict": "API usage info",
                "GET /health": "Health check",
            },
        })

    @app.route("/health", methods=["GET"])
    def health():
        import os
        from config import MODEL_PATH
        model_loaded = os.path.exists(MODEL_PATH)
        return jsonify({
            "status": "healthy",
            "model_loaded": model_loaded,
            "mode": "ml+rules" if model_loaded else "rules-only",
        })

    return app


# ═══════════════════════════════════════════════════════════
#  RUN SERVER
# ═══════════════════════════════════════════════════════════

if __name__ == "__main__":
    app = create_app()

    print("\n" + "=" * 60)
    print("  FRAUD SHIELD AI - Server Starting")
    print("=" * 60)
    print(f"  Host    : {FLASK_HOST}")
    print(f"  Port    : {FLASK_PORT}")
    print(f"  Debug   : {FLASK_DEBUG}")
    print(f"  URL     : http://localhost:{FLASK_PORT}")
    print(f"  Predict : http://localhost:{FLASK_PORT}/predict")
    print("=" * 60 + "\n")

    app.run(
        host=FLASK_HOST,
        port=FLASK_PORT,
        debug=FLASK_DEBUG,
    )
