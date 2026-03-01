import { TagQueries } from "@/lib/db/queries/tag";
import AdminTagsClient from "./components/tags-client";

export default async function AdminTagsPage() {
  const tags = await TagQueries.getAllTags();

  // Separate global (userId is null) from user-specific
  const globalTags = tags.filter((t) => !t.userId);
  const userTags = tags.filter((t) => t.userId);

  return <AdminTagsClient globalTags={globalTags} userTags={userTags} />;
}
