# Argus — Blockchain Risk Intelligence Engine

**Built & Engineered by Pranjal Mourya**  
B.Tech CSE | Data Science & ML Focused  

---

## Overview

Argus is a production-style blockchain anomaly detection system that analyzes Ethereum wallet behavior using graph-based feature engineering and unsupervised machine learning.

It detects anomalous transaction patterns, assigns a calibrated risk score (0–100), generates SHAP-based feature explanations, and immutably records finalized risk flags on-chain (Sepolia testnet).

---

##Live Demo:
Frontend: https://argus-ai-tau.vercel.app
API: https://argus-sd5p.onrender.com/docs
---

## Problem Statement

Blockchain fraud detection requires identifying abnormal wallet behavior without reliable labeled data.

Argus addresses this using:

- Behavioral graph modeling
- Unsupervised anomaly detection
- Explainable AI
- On-chain immutability

---

## System Architecture

**Pipeline Overview:**

1. Ethereum On-Chain Data Ingestion (Etherscan API + Web3)
2. Graph-Based Behavioral Feature Engineering
3. Log-Transformed Heavy-Tailed Feature Stabilization
4. Feature Scaling (StandardScaler)
5. Isolation Forest (contamination = 5%)
6. Heuristic Risk Score Normalization (0–100)
7. SHAP-Based Explainability
8. MongoDB Risk Event Storage
9. Smart Contract Risk Flagging (Sepolia)

AI inference is performed off-chain for scalability.  
Only finalized risk scores are recorded on-chain.

---

## Feature Engineering

Extracted wallet behavioral metrics include:

- Total Transactions
- Unique Counterparties
- Incoming / Outgoing Counts
- Incoming-Outgoing Ratio
- Total Volume (log-transformed)
- Degree Centrality
- Clustering Coefficient

Heavy-tailed financial features are stabilized using log transformation.

---

## Model Design

- Algorithm: Isolation Forest
- Training Data: 600+ real Ethereum wallets
- Contamination: 5%
- Feature Scaling: StandardScaler
- Explainability: SHAP TreeExplainer
- Risk Banding:
  - 0–39 → LOW
  - 40–69 → MEDIUM
  - 70–100 → HIGH

## Model Evaluation

Confusion Matrix (600 wallets):
    [[476 12]
    [ 94 18]]


Overall Accuracy: ~82%  

Note: Labels are heuristic; the system prioritizes minimizing false positives in an unsupervised setting.

---

## Blockchain Integration

Final risk flags are written to a smart contract deployed on the Sepolia testnet, ensuring immutability and auditability.

---

## Tech Stack

Backend:
- Python
- FastAPI
- Scikit-learn
- SHAP
- NetworkX
- MongoDB
- Web3.py

Frontend:
- React
- Material UI

Blockchain:
- Ethereum (Sepolia)
- Solidity Smart Contract

---

## Key Highlights

✔ Real on-chain data ingestion  
✔ Graph-based behavioral modeling  
✔ Unsupervised anomaly detection  
✔ Explainable AI (SHAP)  
✔ Blockchain write-back  
✔ Production-style architecture  

---

## Contact

Pranjal Mourya  
 Email: pranjalmourya04@gmail.com
