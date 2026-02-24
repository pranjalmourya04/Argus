import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider
} from "@mui/material";
import { NavLink } from "react-router-dom";

const drawerWidth = 240;

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#0b1120" }}>
      
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            color: "#fff",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            background: "linear-gradient(180deg,#0f172a,#020617)",
            boxShadow: "0 0 40px rgba(0,0,0,0.5)"

          }
        }}
      >
        {/* Logo / Title */}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              background: "linear-gradient(90deg,#3b82f6,#22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 12px rgba(59,130,246,0.8)"

            }}
          >
            ARGUS
          </Typography>
        </Box>

        <Divider sx={{ background: "rgba(255,255,255,0.05)" }} />

        {/* Navigation */}
        <List sx={{ mt: 2 }}>
          <NavItem to="/" label="Analyze Wallet" />
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/architecture" label="Architecture" />
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 5 },
//           background:
//   "radial-gradient(circle at 20% 20%, rgba(57, 114, 206, 0.15), transparent 40%), radial-gradient(circle at 80% 30%, rgba(34,211,238,0.15), transparent 40%), #020617",

          background:
            "radial-gradient(circle at 20% 20%, #1e3a8a 0%, #0f172a 40%, #020617 100%)",
          minHeight: "100vh",
          color: "#e2e2e2"
        }}
      >
        {children}
        <Box
  sx={{
    mt: 6,
    pt: 3,
    borderTop: "1px solid rgba(255,255,255,0.05)",
    textAlign: "center",
    fontSize: 13,
    opacity: 0.6
  }}
>
          © 2026 Pranjal Mourya | ARGUS Blockchain Risk Intelligence Engine
       </Box>
      </Box>
    </Box>
  );
}

/* ---------- Reusable Nav Item ---------- */

function NavItem({ to, label }) {
  return (
    <ListItemButton
      component={NavLink}
      to={to}
      sx={{
        mx: 2,
        mb: 1,
        borderRadius: 2,
        "&.active": {
          background: "rgba(59,130,246,0.15)",
          border: "1px solid rgba(59,130,246,0.3)"
        },
        "&:hover": {
          background: "rgba(255,255,255,0.05)"
        }
      }}
    >
      <ListItemText primary={label} />
    </ListItemButton>
  );
}
