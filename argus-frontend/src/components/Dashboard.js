import { useEffect, useState } from "react";
import CountUp from "react-countup";
import API_BASE from "../config";

import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Snackbar,
  Alert,
  Divider
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";

const COLORS = {
  HIGH: "#ef4444",
  MEDIUM: "#f59e0b",
  LOW: "#22c55e"
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [trend, setTrend] = useState([]);
  const [socketAlert, setSocketAlert] = useState(null);
  const [openToast, setOpenToast] = useState(false);

  useEffect(() => {
    fetchSummary();

    const socket = new WebSocket("wss://argus-sd5p.onrender.com/ws/alerts");

    socket.onmessage = (event) => {
      const alertData = JSON.parse(event.data);

      if (alertData.risk_level === "HIGH") {
        setSocketAlert(alertData);
        setOpenToast(true);
      }

      fetchSummary();
    };

    return () => socket.close();
  }, []);

  const fetchSummary = async () => {
    try {
      const sum = await axios.get(`${API_BASE}/analytics/summary`);
      const trendData = await axios.get(`${API_BASE}/analytics/risk-trend`);

      setData(sum.data);
      setTrend(trendData.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        <Typography sx={{ color: "#fff" }}>
          Loading Dashboard...
        </Typography>
      </Container>
    );
  }

  const riskData = [
    { name: "HIGH", value: data?.risk_distribution?.HIGH || 0 },
    { name: "MEDIUM", value: data?.risk_distribution?.MEDIUM || 0 },
    { name: "LOW", value: data?.risk_distribution?.LOW || 0 }
  ];

  const threatElevated = (data?.risk_distribution?.HIGH || 0) > 0;

  return (
    <Box sx={pageWrapper}>
      <Container maxWidth="xl">

        {/* Threat Banner */}
        <Box
          sx={{
            ...threatBanner,
            background: threatElevated
              ? "linear-gradient(90deg,#7f1d1d,#991b1b)"
              : "linear-gradient(90deg,#065f46,#047857)"
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            System Threat Level: {threatElevated ? "ELEVATED" : "NORMAL"}
          </Typography>
        </Box>

        {/* Page Title */}
        <Typography variant="h4" sx={pageTitle}>
          Blockchain Intelligence Dashboard
        </Typography>

        {/* Metrics Row */}
        <Grid container spacing={4}>
          <MetricCard
            title="Total Wallets"
            value={data.total_wallets_analyzed}
          />
          <MetricCard
            title="Avg Risk Score"
            value={data.average_risk_score}
          />
          <MetricCard
            title="Avg Inference Latency"
            value={`${data.average_inference_latency_ms} ms`}
          />
        </Grid>

        {/* Risk Trend */}
        <Box sx={{ mt: 6 }}>
          <Card sx={glassStyle}>
            <CardContent>
              <Typography variant="h6" sx={sectionTitle}>
                Risk Trend Analysis
              </Typography>

              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="risk_score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Distribution + Summary */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={7}>
            <Card sx={glassStyle}>
              <CardContent>
                <Typography variant="h6" sx={sectionTitle}>
                  Risk Intelligence Overview
                </Typography>

                <Grid container alignItems="center">
                  <Grid item xs={12} md={6}>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={riskData}
                          dataKey="value"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[entry.name]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <RiskBar
                        label="High Risk"
                        value={riskData[0].value}
                        color={COLORS.HIGH}
                      />
                      <RiskBar
                        label="Medium Risk"
                        value={riskData[1].value}
                        color={COLORS.MEDIUM}
                      />
                      <RiskBar
                        label="Low Risk"
                        value={riskData[2].value}
                        color={COLORS.LOW}
                      />
                    </Box>
                  </Grid>
                </Grid>

              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={glassStyle}>
              <CardContent>
                <Typography variant="h6" sx={sectionTitle}>
                  Security Posture
                </Typography>

                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {threatElevated ? "⚠ Elevated" : "Stable"}
                </Typography>

                <Typography sx={{ mt: 2, opacity: 0.7 }}>
                  {threatElevated
                    ? "High-risk activity detected in monitored wallets."
                    : "System operating within safe behavioral thresholds."}
                </Typography>

                <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

                <Chip
                  label={`High Risk Wallets: ${riskData[0].value}`}
                  sx={{
                    background: COLORS.HIGH,
                    color: "#fff",
                    fontWeight: 600
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Recent Wallet Activity
          </Typography>

          {data?.latest_wallets?.map((wallet) => (
            <Card key={wallet._id} sx={activityCardStyle}>
              <CardContent>
                <Typography sx={{ fontWeight: 600, wordBreak: "break-all" }}>
                  {wallet.wallet}
                </Typography>

                <Chip
                  label={wallet.risk_level}
                  sx={{
                    mt: 1,
                    backgroundColor: COLORS[wallet.risk_level],
                    color: "#fff",
                    fontWeight: 600
                  }}
                />

                <Typography sx={{ mt: 1 }}>
                  Risk Score: <strong>{wallet.risk_score}</strong>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Toast */}
        <Snackbar
          open={openToast}
          autoHideDuration={4000}
          onClose={() => setOpenToast(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="error" variant="filled">
            🚨 High Risk Wallet Detected: {socketAlert?.wallet}
          </Alert>
        </Snackbar>

      </Container>
    </Box>
  );
}

/* ---------------- Components ---------------- */

function MetricCard({ title, value }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={metricCardStyle}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
            {<CountUp end={parseFloat(value)} duration={1.5} />}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function RiskBar({ label, value, color }) {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>{label}</Typography>
        <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
      </Box>

      <Box
        sx={{
          height: 8,
          borderRadius: 5,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            width: `${Math.min(value * 10, 100)}%`,
            height: "100%",
            background: color,
            transition: "width 0.6s ease"
          }}
        />
      </Box>
    </Box>
  );
}

/* ---------------- Styles ---------------- */

const pageWrapper = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 20% 20%, #1e3a8a 0%, #0f172a 40%, #020617 100%)",
  color: "#fff",
  pt: 8,
  pb: 8
};

const pageTitle = {
  mb: 5,
  fontWeight: 700
};

const sectionTitle = {
  mb: 3,
  fontWeight: 600
};

const threatBanner = {
  p: 2,
  borderRadius: 2,
  mb: 4,
  textAlign: "center"
};

const glassStyle = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 3
};

const metricCardStyle = {
  ...glassStyle,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-6px)"
  }
};

const activityCardStyle = {
  mb: 2,
  ...glassStyle,
  transition: "all 0.25s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
  }
};


