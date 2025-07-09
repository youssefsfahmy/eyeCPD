import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { ClientThemeProvider } from "@/components/providers/client-theme-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Eye CPD - Continuing Professional Development for Optometrists",
  description:
    "Professional CPD management platform for optometrists. Track your continuing education, manage certificates, and stay compliant with professional requirements.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}
