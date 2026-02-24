import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix

BASE_DIR = Path(__file__).parent

DATASET_PATH = "real_wallet_dataset.csv"


def train():
    print("Loading real blockchain dataset...")
    df = pd.read_csv(DATASET_PATH)
    print("Label distribution:")
    print(df["label"].value_counts())
    print("\nFeature Statistics:")
    print(df.describe())

    if df.empty:
        raise ValueError("Dataset is empty. Build dataset before training.")
    
    # Separate features and label
    X = df.drop("label", axis=1)
    y = df["label"].values
    for col in ["total_transactions", "unique_counterparties", "incoming_count", "total_volume"]:
      if col in X.columns:
        X[col] = np.log1p(X[col])

    print("Dataset size:", len(X))

    print("Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("Training Isolation Forest...")
    anomaly_rate = df["label"].mean()

    model = IsolationForest(
    n_estimators=200,
    contamination=0.05,
    random_state=42
)
    model.fit(X_scaled)
    # Save training anomaly score distribution for percentile calibration
    train_scores = model.decision_function(X_scaled)

    scores_path = str(BASE_DIR / "train_anomaly_scores.pkl")
    joblib.dump(train_scores, scores_path)

    print(f"Saved training score distribution at {scores_path}")

    # Convert IsolationForest output to binary
    predictions = model.predict(X_scaled)
    predictions = [1 if p == -1 else 0 for p in predictions]

    print("\nConfusion Matrix:")
    print(confusion_matrix(y, predictions))

    print("\nClassification Report:")
    print(classification_report(y, predictions, digits=4))

    joblib.dump(model, "isolation_forest_model.pkl")
    joblib.dump(scaler, "scaler.pkl")

    print("\nModel and scaler saved successfully.")


if __name__ == "__main__":
    train()