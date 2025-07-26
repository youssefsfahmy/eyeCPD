import { notFound } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { ActivityQueries } from "@/lib/db/queries/activity";
import ActivityViewEdit from "./components/activity-view-edit";
import { Alert } from "@mui/material";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ActivityViewPage({ params }: PageProps) {
  const activityId = parseInt(params.id);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <Alert severity="error">You must be logged in to view activities.</Alert>
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

    return <ActivityViewEdit activity={activity} />;
  } catch (error) {
    console.error("Error fetching activity:", error);
    return (
      <Alert severity="error">Failed to load activity. Please try again.</Alert>
    );
  }
}
