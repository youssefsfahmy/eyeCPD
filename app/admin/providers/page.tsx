import { ProviderQueries } from "@/lib/db/queries/provider";
import AdminProvidersClient from "./components/providers-client";

export default async function AdminProvidersPage() {
  const providers = await ProviderQueries.getAllProviders();

  // Separate global (userId is null) from user-specific
  const globalProviders = providers.filter((p) => !p.userId);
  const userProviders = providers.filter((p) => p.userId);

  return (
    <AdminProvidersClient
      globalProviders={globalProviders}
      userProviders={userProviders}
    />
  );
}
