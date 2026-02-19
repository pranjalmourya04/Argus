import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Analyze from "./components/Analyze";
import Dashboard from "./components/Dashboard";
import Architecture from "./components/Architecture";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Analyze />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/architecture" element={<Architecture />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
// import Analyze from "./components/Analyze";
// import Dashboard from "./components/Dashboard";

// function App() {
//   return (
//     <Router>
//       <Box sx={{ background: "#0f172a", minHeight: "100vh", color: "#fff" }}>

//         {/* Top Navigation */}
//         <AppBar position="static" sx={{ background: "#111827" }}>
//           <Toolbar>
//             <Typography variant="h6" sx={{ flexGrow: 1 }}>
//               ARGUS
//             </Typography>

//             <Button color="inherit" component={Link} to="/">
//               Analyze
//             </Button>

//             <Button color="inherit" component={Link} to="/dashboard">
//               Dashboard
//             </Button>

//             <Button color="inherit" component={Link} to="/architecture">
//               Architecture
//             </Button>
//           </Toolbar>
//         </AppBar>

//         <Routes>
//           <Route path="/" element={<Analyze />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/architecture" element={<Architecture />} />
//         </Routes>

//       </Box>
//     </Router>
//   );
// }

// function Architecture() {
//   return (
//     <Box sx={{ p: 6 }}>
//       <Typography variant="h4" sx={{ mb: 3 }}>
//         System Architecture
//       </Typography>

//       <Typography sx={{ mb: 2 }}>
//         ARGUS uses off-chain AI inference combined with on-chain risk flag recording.
//       </Typography>

//       <Typography>
//         Pipeline:
//       </Typography>

//       <ul>
//         <li>Blockchain Transaction Listener</li>
//         <li>Feature Engineering (Graph-based)</li>
//         <li>Isolation Forest Anomaly Detection</li>
//         <li>Risk Scoring Engine</li>
//         <li>Smart Contract Risk Flagging</li>
//         <li>MongoDB Event Storage</li>
//       </ul>
//     </Box>
//   );
// }

// export default App;


// import { useState } from "react";
// import Dashboard from "./components/Dashboard";

// import axios from "axios";
// import {
//   Container,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Chip,
//   Box,
//   Grid,
//   CircularProgress
// } from "@mui/material";
// import { PieChart, Pie, Cell } from "recharts";

// const COLORS = {
//   HIGH: "#ef4444",
//   MEDIUM: "#f59e0b",
//   LOW: "#22c55e"
// };

// export default function App() {
//   const [wallet, setWallet] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [stage, setStage] = useState("");

//   const handleAnalyze = async () => {
//     setError("");
//     setResult(null);

//     // Wallet format validation
//     if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
//       setError("Invalid Ethereum wallet format.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setStage("Running AI anomaly detection...");

//       const res = await axios.post("http://127.0.0.1:8000/analyze", {
//         wallet
//       });

//       setStage("Recording risk on blockchain...");
//       setResult(res.data);
//     } catch (err) {
//       setError("Wallet analysis failed. Check backend or address.");
//     }

//     setLoading(false);
//     setStage("");
//   };

//   const riskData = result
//     ? [
//         { name: "Risk", value: result.risk_score },
//         { name: "Remaining", value: 100 - result.risk_score }
//       ]
//     : [];

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #0f172a, #1e293b)",
//         color: "#fff"
//       }}
//     >
//       <Dashboard />
//       <Container maxWidth="lg" sx={{ pt: 8, pb: 10 }}>
//         <Typography
//           variant="h3"
//           align="center"
//           sx={{
//             fontWeight: 700,
//             mb: 6,
//             background: "linear-gradient(90deg,#3b82f6,#22d3ee)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent"
//           }}
//         >
//           ARGUS Blockchain Fraud Intelligence
//         </Typography>

//         {/* Glass Analyze Card */}
//         <Card
//           sx={{
//             mb: 5,
//             backdropFilter: "blur(20px)",
//             background: "rgba(255,255,255,0.05)",
//             border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: 4
//           }}
//         >
//           <CardContent>
//             <Box
//               display="flex"
//               gap={2}
//               flexDirection={{ xs: "column", sm: "row" }}
//             >
//               <TextField
//                 fullWidth
//                 label="Wallet Address"
//                 variant="outlined"
//                 value={wallet}
//                 onChange={(e) => setWallet(e.target.value)}
//                 InputLabelProps={{ style: { color: "#aaa" } }}
//                 sx={{
//                   input: { color: "#fff" },
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": { borderColor: "#444" },
//                     "&:hover fieldset": { borderColor: "#3b82f6" }
//                   }
//                 }}
//               />
//               <Button
//                 variant="contained"
//                 onClick={handleAnalyze}
//                 disabled={loading}
//                 sx={{
//                   minWidth: 150,
//                   borderRadius: 3,
//                   fontWeight: 600
//                 }}
//               >
//                 {loading ? <CircularProgress size={24} /> : "Analyze"}
//               </Button>
//             </Box>

//             {loading && (
//               <Typography sx={{ mt: 2, opacity: 0.7 }}>
//                 {stage}
//               </Typography>
//             )}

//             {error && (
//               <Typography sx={{ color: "#ef4444", mt: 2 }}>
//                 {error}
//               </Typography>
//             )}
//           </CardContent>
//         </Card>

//         {result && (
//           <Grid container spacing={4}>
//             {/* Risk Gauge */}
//             <Grid item xs={12} md={4}>
//               <Card
//                 sx={{
//                   backdropFilter: "blur(20px)",
//                   background: "rgba(255,255,255,0.05)",
//                   border: "1px solid rgba(255,255,255,0.1)",
//                   borderRadius: 4,
//                   textAlign: "center"
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6">Risk Score</Typography>

//                   <PieChart width={220} height={220}>
//                     <Pie
//                       data={riskData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={70}
//                       outerRadius={90}
//                       startAngle={90}
//                       endAngle={-270}
//                       dataKey="value"
//                     >
//                       <Cell
//                         fill={
//                           COLORS[result.risk_level?.toUpperCase()] ||
//                           "#3b82f6"
//                         }
//                       />
//                       <Cell fill="#1e293b" />
//                     </Pie>
//                   </PieChart>

//                   <Typography variant="h4" sx={{ fontWeight: 700 }}>
//                     {result.risk_score}
//                   </Typography>

//                   <Chip
//                     label={result.risk_level}
//                     sx={{
//                       mt: 1,
//                       backgroundColor:
//                         COLORS[result.risk_level?.toUpperCase()] ||
//                         "#3b82f6",
//                       color: "#fff",
//                       fontWeight: 600
//                     }}
//                   />
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Details */}
//             <Grid item xs={12} md={8}>
//               <Card
//                 sx={{
//                   backdropFilter: "blur(20px)",
//                   background: "rgba(255,255,255,0.05)",
//                   border: "1px solid rgba(255,255,255,0.1)",
//                   borderRadius: 4
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" sx={{ mb: 2 }}>
//                     Analysis Details
//                   </Typography>

//                   <Typography>
//                     Inference Time:{" "}
//                     <strong>
//                       {result.inference_time_ms.toFixed(2)} ms
//                     </strong>
//                   </Typography>

//                   <Typography>
//                     Total Processing Time:{" "}
//                     <strong>
//                       {result.total_request_time_ms.toFixed(2)} ms
//                     </strong>
//                   </Typography>

//                   <Box sx={{ mt: 3 }}>
//                     <Typography variant="subtitle1" sx={{ mb: 1 }}>
//                       Explanations
//                     </Typography>
//                     {result.explanations.map((exp, index) => (
//                       <Typography key={index}>• {exp}</Typography>
//                     ))}
//                   </Box>

//                   <Box sx={{ mt: 3 }}>
//                     <Typography variant="subtitle2">
//                       Transaction Hash
//                     </Typography>

//                     {result.tx_hash ? (
//                       <a
//                         href={`https://sepolia.etherscan.io/tx/${result.tx_hash}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={{
//                           color: "#22d3ee",
//                           wordBreak: "break-all"
//                         }}
//                       >
//                         {result.tx_hash}
//                       </a>
//                     ) : (
//                       <Typography color="#aaa">
//                         Blockchain not executed
//                       </Typography>
//                     )}

//                     <Chip
//                       label={result.confirmation_status}
//                       sx={{
//                         mt: 1,
//                         backgroundColor:
//                           result.confirmation_status === "SUCCESS"
//                             ? "#22c55e"
//                             : "#ef4444",
//                         color: "#fff",
//                         fontWeight: 600
//                       }}
//                     />
//                   </Box>

//                   <Typography sx={{ mt: 3, opacity: 0.6 }}>
//                     Model: Isolation Forest v3 (Scaled Graph Features)
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         )}
//       </Container>
//     </Box>
//   );
// }






