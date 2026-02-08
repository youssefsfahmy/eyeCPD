import DashboardPage from "@/components/dashboard";
interface PageProps {
  searchParams: Promise<{ cycle?: string; draft?: string }>;
}

async function Page({ searchParams }: PageProps) {
  const { cycle, draft } = await searchParams;
  return (
    <DashboardPage
      cycle={typeof cycle === "string" ? cycle : null}
      draft={draft === "true"}
    />
  );
}

export default Page;
