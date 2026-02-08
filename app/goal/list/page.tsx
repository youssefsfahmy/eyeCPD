import GoalListServerPage from ".";

interface PageProps {
  searchParams: Promise<{ cycle?: string; draft?: string }>;
}

async function Page({ searchParams }: PageProps) {
  const { cycle } = await searchParams;
  return (
    <GoalListServerPage cycle={typeof cycle === "string" ? cycle : null} />
  );
}

export default Page;
