import DashboardPage from "@/components/dashboard";
import React from "react";
interface PageProps {
  searchParams: Promise<{ cycle?: string }>;
}

async function Page({ searchParams }: PageProps) {
  const { cycle } = await searchParams;
  return <DashboardPage cycle={typeof cycle === "string" ? cycle : null} />;
}

export default Page;
