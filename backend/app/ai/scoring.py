import joblib
import numpy as np
from pathlib import Path
import shap
from .explainability import generate_explanation
from .features import simulate_transactions, extract_graph_features
import time
from app.services.onchain_features import get_wallet_graph




# -----------------------------
# Load Model + Scaler Once
# -----------------------------
BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "isolation_forest_model.pkl"
SCALER_PATH = BASE_DIR / "scaler.pkl"
SCORES_PATH = BASE_DIR / "train_anomaly_scores.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

train_scores = joblib.load(SCORES_PATH)
explainer = shap.TreeExplainer(model)



def generate_risk_score(wallet_ml):
    wallet = wallet_ml.lower()
    

    global model, scaler

    
    """
    ML-based anomaly scoring using Isolation Forest
    with scaled behavioral + graph features.
    """

    # 1️⃣ Simulate wallet transaction graph
    # G = simulate_transactions(wallet)
    G = get_wallet_graph(wallet)
    
    if G.number_of_nodes() == 1:
    # fallback if no transactions found
      G = simulate_transactions(wallet, suspicious=False)


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
        # features["clustering_coefficient"]

    ]])
    # Apply log transform to heavy-tailed features
    feature_vector[0][0] = np.log1p(feature_vector[0][0])  # total_transactions
    feature_vector[0][1] = np.log1p(feature_vector[0][1])  # unique_counterparties
    feature_vector[0][2] = np.log1p(feature_vector[0][2])  # incoming_count
    feature_vector[0][5] = np.log1p(feature_vector[0][5])  # total_volume

    # 4️⃣ Scale features
    feature_vector_scaled = scaler.transform(feature_vector)

    shap_values = explainer.shap_values(feature_vector_scaled)
    shap_contributions = shap_values[0]

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

    

    risk_score = max(0, min(100, risk_score))
    feature_names = [
    "total_transactions",
    "unique_counterparties",
    "incoming_count",
    "outgoing_count",
    "incoming_outgoing_ratio",
    "total_volume",
    "degree_centrality"
]
    contribution_pairs = list(zip(feature_names, shap_contributions))
    sorted_features = sorted(contribution_pairs, key=lambda x: abs(x[1]), reverse=True)

    top_features = sorted_features[:3]

    explanations = [
    f"{feature} contributed strongly to anomaly score"
    for feature, _ in top_features
]



    # 7️⃣ Risk Level Classification
    if risk_score >= 70:
      level = "HIGH"
    elif risk_score >= 40:
      level = "MEDIUM"
    else:
      level = "LOW"

    

    end_time = time.time()
    inference_time_ms = round((end_time - start_time) * 1000, 2)
    t1 = time.time()
    feature_vector_scaled = scaler.transform(feature_vector)
    t2 = time.time()
    
    t3 = time.time()
    anomaly_score = model.decision_function(feature_vector_scaled)[0]
    t4 = time.time()

    print("Scaling:", (t2 - t1) * 1000)
    print("Predict:", (t3 - t2) * 1000)
    print("Decision:", (t4 - t3) * 1000)
    print("Anomaly Score:", anomaly_score)
    print("Training Score Min:", train_scores.min())
    print("Training Score Max:", train_scores.max())
    


    return risk_score, level, features, explanations, inference_time_ms
