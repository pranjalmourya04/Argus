import { Box, Typography, Card, CardContent, Divider } from "@mui/material";

export default function Architecture() {
  return (
    <Box sx={{ p: 6 }}>

      {/* Title */}
      <Typography variant="h4" sx={{ mb: 1 }}>
        ARGUS System Architecture
      </Typography>

      <Typography
        variant="subtitle2"
        sx={{ mb: 4, opacity: 0.7 }}
      >
        Built & Engineered by Pranjal Mourya
      </Typography>

      {/* Pipeline Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            End-to-End Pipeline Overview
          </Typography>

          <ul>
            <li>Ethereum On-Chain Data Ingestion (Etherscan API + Web3)</li>
            <li>Graph-Based Behavioral Feature Engineering</li>
            <li>Log-Transformed Feature Stabilization</li>
            <li>Isolation Forest (Unsupervised Anomaly Detection)</li>
            <li>Heuristic Risk Score Normalization (0–100)</li>
            <li>SHAP-Based Explainability Engine</li>
            <li>MongoDB Risk Event Persistence</li>
            <li>Smart Contract Risk Flagging (Sepolia Testnet)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Model Details */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Model & Risk Engine Details
          </Typography>

          <Typography sx={{ mb: 2 }}>
            • Trained on 600+ real Ethereum wallets  
            • Isolation Forest with contamination = 5%  
            • Heavy-tailed features stabilized using log transformation  
            • SHAP values computed for per-wallet feature contribution  
            • Final risk categorized into LOW / MEDIUM / HIGH bands
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3, opacity: 0.2 }} />

      {/* Explanation */}
      <Typography sx={{ opacity: 0.8 }}>
        AI inference is performed off-chain for scalability. Only finalized risk
        scores are immutably recorded on-chain, ensuring transparency without
        sacrificing performance.
      </Typography>

      <Typography sx={{ mt: 3, opacity: 0.6, fontSize: 14 }}>
        Argus demonstrates a production-style anomaly detection pipeline
        combining graph-based behavioral modeling, unsupervised learning,
        explainable AI, and blockchain immutability.
      </Typography>

    </Box>
  );
}

