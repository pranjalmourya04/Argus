import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  ThemeProvider,
  createTheme,
  CssBaseline
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6"
    },
    secondary: {
      main: "#22d3ee"
    },
    error: {
      main: "#ef4444"
    },
    warning: {
      main: "#f59e0b"
    },
    success: {
      main: "#22c55e"
    },
    background: {
      default: "#020617",
      paper: "rgba(255,255,255,0.05)"
    }
  },

  typography: {
    fontFamily: "Inter, sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: 1
    },
    h6: {
      fontWeight: 600
    }
  },

  shape: {
    borderRadius: 14
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "all 0.3s ease",
          boxShadow: "0 0 20px rgba(59,130,246,0.05)",
          "&:hover": {
            boxShadow: "0 0 30px rgba(59,130,246,0.25)"
          }
        }
      }
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "linear-gradient(180deg,#0f172a,#020617)",
          borderRight: "1px solid rgba(255,255,255,0.05)"
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10
        }
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
