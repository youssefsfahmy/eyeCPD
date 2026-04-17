import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { ClientThemeProvider } from "@/components/providers/client-theme-provider";
import { ProfileProvider } from "@/lib/context/profile-context";
import Nav from "@/components/layout/nav";
import FooterNav from "@/components/layout/footer-nav";
import LazyFeedbackButton from "@/components/feedback/lazy-feedback-button";

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
      <head>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        )}
      </head>
      <body
        className={`${geistSans.className} antialiased `}
        // style={{ backgroundColor: "#eff6ff" }}
        style={{ backgroundColor: "var(--background)" }}
      >
        <ClientThemeProvider>
          <ProfileProvider>
            <Nav />
            <div className="mx-2 sm:mx-3 md:mx-4 lg:mx-5 xl:mx-6">
              {children}
            </div>
            <FooterNav />
            <LazyFeedbackButton />
          </ProfileProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
