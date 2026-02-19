import numpy as np
import joblib
import random
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from app.ai.features import simulate_transactions, extract_graph_features
from sklearn.metrics import classification_report, confusion_matrix


NUM_SAMPLES = 500

def generate_dataset(n=NUM_SAMPLES):
    X = []
    y = []  # ground truth labels

    for i in range(n):
        wallet = f"wallet_{i}"

        # 20% suspicious wallets
        if random.random() < 0.2:
            G = simulate_transactions(wallet, suspicious=True)
            label = 1  # fraud
        else:
            G = simulate_transactions(wallet, suspicious=False)
            label = 0  # normal

        features = extract_graph_features(G, wallet)

        feature_vector = [
            features["total_transactions"],
            features["unique_counterparties"],
            features["incoming_count"],
            features["outgoing_count"],
            features["incoming_outgoing_ratio"],
            features["total_volume"],
            features["degree_centrality"],
            features["clustering_coefficient"]
        ]

        X.append(feature_vector)
        y.append(label)

    return np.array(X), np.array(y)



def train():
    print("Generating dataset...")
    X, y = generate_dataset()

    print("Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("Training Isolation Forest...")
    model = IsolationForest(
        n_estimators=200,
        contamination=0.2,  # match synthetic rate
        random_state=42
    )

    model.fit(X_scaled)

    # Convert IF output to binary (1 = fraud, 0 = normal)
    predictions = model.predict(X_scaled)
    predictions = np.where(predictions == -1, 1, 0)

    print("\n📊 Confusion Matrix:")
    print(confusion_matrix(y, predictions))

    print("\n📈 Classification Report:")
    print(classification_report(y, predictions, digits=4))

    joblib.dump(model, "isolation_forest_model.pkl")
    joblib.dump(scaler, "scaler.pkl")

    print("\nModel and scaler saved successfully.")


if __name__ == "__main__":
    train()
