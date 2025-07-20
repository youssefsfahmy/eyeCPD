// app/loading.tsx
import { FullPageLoading } from "@/components/ui/loading";

export default function GlobalLoading() {
  return (
    <FullPageLoading
      title="Loading your workspace"
      subtitle="Preparing your professional development platform..."
      variant="default"
      showProgress={true}
    />
  );
}
