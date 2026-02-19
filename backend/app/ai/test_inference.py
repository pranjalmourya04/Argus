import joblib
import numpy as np
from pathlib import Path

from app.ai.features import simulate_transactions, extract_graph_features

# Load artifacts manually
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "isolation_forest_model.pkl"
SCALER_PATH = BASE_DIR / "scaler.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


for i in range(5):

    wallet = f"wallet_test_{i}"

    # FORCE suspicious behavior
    G = simulate_transactions(wallet, suspicious=True)
    features = extract_graph_features(G, wallet)

    feature_vector = np.array([[
        features["total_transactions"],
        features["unique_counterparties"],
        features["incoming_count"],
        features["outgoing_count"],
        features["incoming_outgoing_ratio"],
        features["total_volume"],
        features["degree_centrality"],
        features["clustering_coefficient"]
    ]])

    feature_vector_scaled = scaler.transform(feature_vector)

    prediction = model.predict(feature_vector_scaled)[0]
    anomaly_score = model.decision_function(feature_vector_scaled)[0]

    risk_score = int((0.5 - anomaly_score) * 100)
    risk_score = max(0, min(100, risk_score))

    print("Prediction:", prediction)
    print("Anomaly Score:", anomaly_score)
    print("Risk Score:", risk_score)
    print("--------------")
