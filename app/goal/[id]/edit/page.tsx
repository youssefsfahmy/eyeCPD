import { notFound } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { Alert } from "@mui/material";
import { GoalQueries } from "@/lib/db/queries/goal";
import GoalEditPage from "./components/goal-edit-page";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditGoalPage({ params }: PageProps) {
  const { id } = await params;
  const goalId = parseInt(id);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Alert severity="error">You must be logged in to edit goals.</Alert>;
  }

  if (isNaN(goalId)) {
    notFound();
  }

  try {
    const goal = await GoalQueries.getGoalById(goalId, user.id);

    if (!goal) {
      notFound();
    }

    return <GoalEditPage goal={goal} />;
  } catch (error) {
    console.error("Error fetching goal:", error);
    return (
      <Alert severity="error">Failed to load activity. Please try again.</Alert>
    );
  }
}
