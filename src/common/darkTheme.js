// Dark Theme Colors
export const darkTheme = {
  // Primary Colors
  primaryBg: "#0d0d0d", // Very dark background
  secondaryBg: "#1a1a1a", // Slightly lighter background
  cardBg: "#262626", // Card background
  borderColor: "#404040", // Border color

  // Text Colors
  primaryText: "#ffffff", // Main text
  secondaryText: "#a6a6a6", // Secondary/muted text
  tertiaryText: "#8c8c8c", // Tertiary text

  // Accent Colors (kept from original)
  success: "#52c41a",
  processing: "#1890ff",
  warning: "#faad14",
  error: "#ff4d4f",

  // Hover/Focus states
  hover: "#333333",
  focus: "#404040",
};

// Global dark theme styles
export const globalDarkStyles = {
  body: {
    background: darkTheme.primaryBg,
    color: darkTheme.primaryText,
  },
  layout: {
    background: darkTheme.primaryBg,
    minHeight: "100vh",
  },
  card: {
    background: darkTheme.cardBg,
    color: darkTheme.primaryText,
    border: `1px solid ${darkTheme.borderColor}`,
  },
  sider: {
    background: darkTheme.cardBg,
    borderRight: `1px solid ${darkTheme.borderColor}`,
  },
  text: {
    color: darkTheme.primaryText,
  },
  secondaryText: {
    color: darkTheme.secondaryText,
  },
  content: {
    background: darkTheme.primaryBg,
    color: darkTheme.primaryText,
  },
};
