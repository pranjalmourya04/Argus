import { Box, Typography, Card, CardContent } from "@mui/material";

export default function Architecture() {
  return (
    <Box sx={{ p: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        ARGUS System Architecture
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">Pipeline Overview</Typography>

          <ul>
            <li>Blockchain Event Listener</li>
            <li>Graph-Based Feature Engineering</li>
            <li>Isolation Forest Anomaly Detection</li>
            <li>Risk Scoring Engine</li>
            <li>Smart Contract Risk Flagging (Sepolia)</li>
            <li>MongoDB Event Storage</li>
          </ul>
        </CardContent>
      </Card>

      <Typography>
        AI inference is performed off-chain for scalability. 
        Only finalized risk scores are immutably recorded on-chain.
      </Typography>
    </Box>
  );
}
