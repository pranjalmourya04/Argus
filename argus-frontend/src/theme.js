import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6"
    },
    secondary: {
      main: "#22d3ee"
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
    }
  },
  shape: {
    borderRadius: 12
  }
});

export default theme;
