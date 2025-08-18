import { notFound } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { ActivityQueries } from "@/lib/db/queries/activity";
import ActivityEditPage from "./components/activity-edit-page";
import { Alert } from "@mui/material";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditActivityPage({ params }: PageProps) {
  const { id } = await params;
  const activityId = parseInt(id);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Alert severity="error">You must be logged in to edit activities.</Alert>
    );
  }

  if (isNaN(activityId)) {
    notFound();
  }

  try {
    const activity = await ActivityQueries.getActivityById(activityId, user.id);

    if (!activity) {
      notFound();
    }

    return <ActivityEditPage activity={activity} />;
  } catch (error) {
    console.error("Error fetching activity:", error);
    return (
      <Alert severity="error">Failed to load activity. Please try again.</Alert>
    );
  }
}
