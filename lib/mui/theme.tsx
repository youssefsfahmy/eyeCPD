"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ReactNode } from "react";

// Custom color palette
const customColors = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#2562ea",
    600: "#1d4ed8",
    700: "#1e40af",
    800: "#1e3a8a",
    900: "#1e3a8a",
    950: "#172554",
  },
  secondary: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#079669",
    600: "#047857",
    700: "#065f46",
    800: "#064e3b",
    900: "#064e3b",
    950: "#022c22",
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
};

// Create the theme
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: customColors.primary[500],
      light: customColors.primary[400],
      dark: customColors.primary[800],
      contrastText: "#ffffff",
    },
    secondary: {
      main: customColors.secondary[500],
      light: customColors.secondary[400],
      dark: customColors.secondary[800],
      contrastText: "#ffffff",
    },
    success: {
      main: customColors.success[600],
      light: customColors.success[400],
      dark: customColors.success[800],
      contrastText: "#ffffff",
    },
    warning: {
      main: customColors.warning[500],
      light: customColors.warning[400],
      dark: customColors.warning[700],
      contrastText: "#ffffff",
    },
    error: {
      main: customColors.error[600],
      light: customColors.error[400],
      dark: customColors.error[800],
      contrastText: "#ffffff",
    },
    background: {
      default: customColors.neutral[50],
      paper: "#ffffff",
    },
    text: {
      primary: customColors.neutral[900],
      secondary: customColors.neutral[600],
    },
    divider: customColors.neutral[200],
    grey: customColors.neutral,
    info: {
      main: "#0288d1",
      light: "#03a9f4",
      dark: "#01579b",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          "&:hover": {
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 4,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: customColors.primary[400],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: customColors.primary[600],
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

// Dark theme variant
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "dark",
    background: {
      default: customColors.neutral[900],
      paper: customColors.neutral[800],
    },
    text: {
      primary: customColors.neutral[100],
      secondary: customColors.neutral[400],
    },
    divider: customColors.neutral[700],
  },
});

// Theme provider component
interface CustomThemeProviderProps {
  children: ReactNode;
  isDark?: boolean;
}

export function CustomThemeProvider({
  children,
  isDark = false,
}: CustomThemeProviderProps) {
  const selectedTheme = isDark ? darkTheme : theme;

  return (
    <ThemeProvider theme={selectedTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

// Export color palette for use in other components
export { customColors };
