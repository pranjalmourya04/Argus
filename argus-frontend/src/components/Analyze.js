import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  CircularProgress,
  Divider
} from "@mui/material";
import { analyzeWallet } from "../api";

const RISK_COLORS = {
  HIGH: "#ef4444",
  MEDIUM: "#f59e0b",
  LOW: "#22c55e"
};

function Analyze() {
  const [wallet, setWallet] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!wallet) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeWallet(wallet);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze wallet.");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>

      {/* HERO SECTION */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          ARGUS Wallet Intelligence
        </Typography>

        <Typography sx={{ opacity: 0.7, maxWidth: 600 }}>
          AI-powered blockchain risk detection engine. Analyze wallet
          behavioral patterns, anomaly signals, and transaction risk scoring
          in real-time.
        </Typography>
      </Box>

      {/* SCANNER PANEL */}
      <Card sx={{ p: 4 }}>
        <CardContent>

          <Grid container spacing={3} alignItems="center">

            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="Wallet Address"
                placeholder="0x..."
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAnalyze}
                disabled={loading}
                sx={{
                  height: "56px",
                  fontWeight: 600,
                  boxShadow: "0 0 20px rgba(59,130,246,0.3)"
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Analyze"}
              </Button>
            </Grid>

          </Grid>

          {error && (
            <Typography sx={{ mt: 2, color: "error.main" }}>
              {error}
            </Typography>
          )}

        </CardContent>
      </Card>

      {/* RESULT PANEL */}
      {result && (
        <Card sx={{ mt: 6, p: 4 }}>
          <CardContent>

            <Grid container spacing={4}>

              {/* LEFT SIDE — RISK SUMMARY */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Risk Assessment
                </Typography>

                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {result.risk_score}
                </Typography>

                <Chip
                  label={result.risk_level}
                  sx={{
                    mt: 2,
                    background: RISK_COLORS[result.risk_level],
                    color: "#fff",
                    fontWeight: 600
                  }}
                />
              </Grid>

              {/* RIGHT SIDE — METADATA */}
              <Grid item xs={12} md={8}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Intelligence Metrics
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography>
                    Inference Time:{" "}
                    <strong>
                      {result.inference_time_ms.toFixed(2)} ms
                    </strong>
                  </Typography>

                  <Typography>
                    Total Request Time:{" "}
                    <strong>
                      {result.total_request_time_ms.toFixed(2)} ms
                    </strong>
                  </Typography>

                  <Typography>
                    Block Number: <strong>{result.block_number}</strong>
                  </Typography>

                  <Typography>
                    Confirmation Status:{" "}
                    <strong>{result.confirmation_status}</strong>
                  </Typography>
                </Box>

                {result.tx_hash && (
                  <Box sx={{ mt: 2 }}>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${result.tx_hash}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#3b82f6", fontWeight: 600 }}
                    >
                      View Transaction on Etherscan →
                    </a>
                  </Box>
                )}

              </Grid>

            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* EXPLANATIONS */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              AI Explanations
            </Typography>

            <Box component="ul" sx={{ pl: 3 }}>
              {result.explanations.map((item, index) => (
                <li key={index}>
                  <Typography sx={{ mb: 1 }}>
                    {item}
                  </Typography>
                </li>
              ))}
            </Box>

          </CardContent>
        </Card>
      )}

    </Container>
  );
}

export default Analyze;



// import React, { useState } from "react";
// import { analyzeWallet } from "../api";

// function Analyze() {
//   const [wallet, setWallet] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleAnalyze = async () => {
//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const data = await analyzeWallet(wallet);
//       setResult(data);
//     } catch (err) {
//       setError("Failed to analyze wallet.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={{ maxWidth: "800px", margin: "40px auto" }}>
//       <div className="glass-card">
//         <h2>ARGUS Wallet Intelligence</h2>

//         <input
//           type="text"
//           placeholder="Enter wallet address..."
//           value={wallet}
//           onChange={(e) => setWallet(e.target.value)}
//           style={{
//             width: "100%",
//             padding: "12px",
//             borderRadius: "10px",
//             border: "none",
//             marginBottom: "15px",
//           }}
//         />

//         <button
//           onClick={handleAnalyze}
//           disabled={loading}
//           style={{
//             padding: "10px 20px",
//             borderRadius: "10px",
//             border: "none",
//             background: "#00d4ff",
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           {loading ? "Analyzing..." : "Analyze"}
//         </button>

//         {error && <p style={{ color: "red" }}>{error}</p>}
//       </div>

//       {result && (
//         <div className="glass-card" style={{ marginTop: "20px" }}>
//           <h3>Risk Score: {result.risk_score}</h3>
//           <p>Risk Level: {result.risk_level}</p>
//           <p>Inference Time: {result.inference_time_ms.toFixed(2)} ms</p>
//           <p>Total Request Time: {result.total_request_time_ms.toFixed(2)} ms</p>

//           <h4>Explanations:</h4>
//           <ul>
//             {result.explanations.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//           </ul>

//           {result.tx_hash && (
//             <p>
//               Transaction:{" "}
//               <a
//                 href={`https://sepolia.etherscan.io/tx/${result.tx_hash}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: "#00d4ff" }}
//               >
//                 View on Etherscan
//               </a>
//             </p>
//           )}

//           <p>Block Number: {result.block_number}</p>
//           <p>Status: {result.confirmation_status}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Analyze;
