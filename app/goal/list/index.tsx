import { getGoalsServerAction } from "../actions";
import { createClient } from "@/app/lib/supabase/server";
import { Alert } from "@mui/material";
import GoalListPage from "./components/goal-list";
import { CycleDraftProps } from "@/app/lib/types";

export default async function GoalListServerPage({ cycle }: CycleDraftProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Alert severity="error">
        You must be logged in to view learning goals.
      </Alert>
    );
  }

  const result = await getGoalsServerAction(cycle);
  const goals = result.success ? result.goals || [] : [];

  return <GoalListPage fetchedGoals={goals} />;
}
