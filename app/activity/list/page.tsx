import ActivityListPage from "./index";

interface PageProps {
  searchParams: Promise<{ cycle?: string; draft?: string }>;
}

async function Page({ searchParams }: PageProps) {
  const { cycle, draft } = await searchParams;
  return (
    <ActivityListPage
      cycle={typeof cycle === "string" ? cycle : null}
      draft={draft === "true"}
    />
  );
}

export default Page;
