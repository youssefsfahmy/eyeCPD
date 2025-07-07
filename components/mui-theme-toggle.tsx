"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useCustomTheme } from "@/lib/mui/use-theme";

export function MuiThemeToggle() {
  const { isDark, toggleTheme, mounted } = useCustomTheme();

  if (!mounted) {
    return (
      <IconButton size="small" disabled>
        <Brightness7 />
      </IconButton>
    );
  }

  return (
    <Tooltip title={`Switch to ${isDark ? "light" : "dark"} mode`}>
      <IconButton onClick={toggleTheme} color="inherit" size="small">
        {isDark ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}
