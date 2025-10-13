/**
 * Material UI Theme Configuration
 *
 * Centralized theme with Hausa Wedding Guide brand colors
 * This theme can be gradually expanded as we integrate more MUI components
 */

import { createTheme } from "@mui/material/styles";

export const hausaTheme = createTheme({
  palette: {
    primary: {
      main: "#740015", // Burgundy
      light: "#990200",
      dark: "#4a0000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#531946", // Maroon
      light: "#6b2159",
      dark: "#3a1130",
      contrastText: "#ffffff",
    },
    terracotta: {
      main: "#CE805C",
      light: "#d89b7f",
      dark: "#B87050",
    },
    sage: {
      main: "#57886C",
      light: "#6fa385",
      dark: "#3d6150",
    },
    success: {
      main: "#57886C", // Sage green for success states
    },
    warning: {
      main: "#CE805C", // Terracotta for warnings
    },
    error: {
      main: "#740015", // Burgundy for errors
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: "Playfair Display, Georgia, serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "Playfair Display, Georgia, serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "Playfair Display, Georgia, serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "Playfair Display, Georgia, serif",
      fontWeight: 500,
    },
    h5: {
      fontFamily: "Playfair Display, Georgia, serif",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "Playfair Display, Georgia, serif",
      fontWeight: 500,
    },
    button: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      textTransform: "none", // Preserve original casing
    },
  },
  shape: {
    borderRadius: 8, // Matches your Tailwind rounded-lg
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1E1E1E",
          color: "#ffffff",
          fontSize: "0.875rem",
          fontFamily: "Inter, sans-serif",
          borderRadius: "6px",
          padding: "8px 12px",
        },
        arrow: {
          color: "#1E1E1E",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

export default hausaTheme;
