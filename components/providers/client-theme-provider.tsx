"use client";

import { CustomThemeProvider } from "@/lib/mui/theme";
import { useCustomTheme } from "@/lib/mui/use-theme";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface ClientThemeProviderProps {
  children: ReactNode;
}

export function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MuiThemeWrapper>{children}</MuiThemeWrapper>
    </NextThemeProvider>
  );
}

function MuiThemeWrapper({ children }: { children: ReactNode }) {
  const { isDark, mounted } = useCustomTheme();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <CustomThemeProvider isDark={false}>{children}</CustomThemeProvider>;
  }

  return <CustomThemeProvider isDark={isDark}>{children}</CustomThemeProvider>;
}
