import joblib
import numpy as np
from pathlib import Path
from .explainability import generate_explanation
from .features import simulate_transactions, extract_graph_features
import time



# -----------------------------
# Load Model + Scaler Once
# -----------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent

MODEL_PATH = BASE_DIR / "isolation_forest_model.pkl"
SCALER_PATH = BASE_DIR / "scaler.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)



def generate_risk_score(wallet: str):
    

    global model, scaler

    
    """
    ML-based anomaly scoring using Isolation Forest
    with scaled behavioral + graph features.
    """

    # 1️⃣ Simulate wallet transaction graph
    # G = simulate_transactions(wallet)
    G = simulate_transactions(wallet, suspicious=True)

    # 2️⃣ Extract engineered features
    features = extract_graph_features(G, wallet)
    start_time = time.time()

    # 3️⃣ Build feature vector (ORDER MUST MATCH TRAINING)
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

    # 4️⃣ Scale features
    feature_vector_scaled = scaler.transform(feature_vector)

    # 5️⃣ Isolation Forest inference
    anomaly_score = model.decision_function(feature_vector_scaled)[0]

    if anomaly_score < 0:
        prediction = -1
    else:
        prediction = 1


    # 6️⃣ Convert anomaly score → 0–100 Risk Score
    # IF outputs roughly in [-0.5, 0.5]
    # Observed typical IF range ~ [-0.2, 0.2]
    min_score = -0.2
    max_score = 0.2

    normalized = (anomaly_score - min_score) / (max_score - min_score)
    risk_score = int((1 - normalized) * 100)

    risk_score = max(0, min(100, risk_score))
    explanations = generate_explanation(features, risk_score)



    # 7️⃣ Risk Level Classification
    if prediction== -1:
        level = "HIGH"
    elif risk_score > 50:
        level = "MEDIUM"
    else:
        level = "LOW"

    print("RAW FEATURES:", feature_vector)
    print("SCALED FEATURES:", feature_vector_scaled)
    print("ANOMALY SCORE:", anomaly_score)
    print("PREDICTION:", prediction)
    print("FINAL RISK SCORE:", risk_score)

    end_time = time.time()
    inference_time_ms = round((end_time - start_time) * 1000, 2)
    t1 = time.time()
    feature_vector_scaled = scaler.transform(feature_vector)
    t2 = time.time()
    prediction = model.predict(feature_vector_scaled)
    t3 = time.time()
    anomaly_score = model.decision_function(feature_vector_scaled)[0]
    t4 = time.time()

    print("Scaling:", (t2 - t1) * 1000)
    print("Predict:", (t3 - t2) * 1000)
    print("Decision:", (t4 - t3) * 1000)


    return risk_score, level, features, explanations, inference_time_ms
