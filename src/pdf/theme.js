// src/pdf/theme.js
// Brand colors and typography for the Hausa Wedding Guide PDF

export const theme = {
  colors: {
    // Primary brand colors (from muiTheme.js)
    primary: "#740015", // Burgundy - main brand color
    primaryLight: "#990200",
    primaryDark: "#4a0000",

    // Secondary brand colors
    secondary: "#531946", // Maroon
    secondaryLight: "#6b2159",

    // Accent colors
    gold: "#D4AF37", // Gold - for borders and accents
    goldLight: "#E8D48A",
    terracotta: "#CE805C", // Warm accent
    terracottaLight: "#d89b7f",
    sage: "#57886C", // Success/positive
    sageLight: "#6fa385",

    // Backgrounds
    background: "#FDF8F4", // Cream
    backgroundAlt: "#F5EDE6",
    white: "#FFFFFF",

    // Text colors
    text: "#1E1E1E",
    textLight: "#4A4A4A",
    textMuted: "#888888",

    // Borders
    border: "#E0D5CC",
    borderLight: "#F0EBE6",
    lightGray: "#E8E8E8",
  },

  fonts: {
    header: "Times-Roman", // Built-in serif font (elegant)
    body: "Helvetica", // Built-in sans-serif (clean)
    bold: "Helvetica-Bold",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 30,
  },
};

// Format currency in Naira
export const formatCurrency = (amount) => {
  if (!amount || amount === 0) return "—";
  return "₦" + Number(amount).toLocaleString();
};

// Format date nicely
export const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Get countdown to wedding
export const getCountdown = (weddingDate) => {
  if (!weddingDate) return null;
  const wedding = new Date(weddingDate);
  const today = new Date();
  const diffTime = wedding - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: "Your special day has arrived!", days: 0 };

  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;

  if (months > 0) {
    return {
      text: `${months} month${months > 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""} until your big day!`,
      days: diffDays,
    };
  }
  return {
    text: `${diffDays} day${diffDays !== 1 ? "s" : ""} until your big day!`,
    days: diffDays,
  };
};
