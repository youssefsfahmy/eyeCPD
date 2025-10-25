"use server";

import { ActivityQueries } from "@/lib/db/queries/activity";
import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActivityActionState, ActivityDataState } from "./types/activity";

export async function getActivitiesServerAction(): Promise<ActivityActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      activities: [],
      isPending: false,
      success: false,
      message: "",
      error: "User not authenticated",
    };
  }

  try {
    const activities = await ActivityQueries.getActivitiesByUserId(
      user.id,
      undefined,
      undefined,
      true
    );

    const activitiesData: ActivityDataState[] = activities.map((activity) => ({
      id: activity.id,
      userId: activity.userId,
      clinical: activity.clinical,
      nonClinical: activity.nonClinical,
      interactive: activity.interactive,
      therapeutic: activity.therapeutic,
      name: activity.name,
      date: activity.date,
      hours: activity.hours,
      description: activity.description,
      reflection: activity.reflection,
      evidenceFileUrl: activity.evidenceFileUrl,
      isDraft: activity.isDraft,
      activityToTags: activity.activityToTags,
      providerId: activity.providerId,
      provider: activity.provider,
    }));

    return {
      activities: activitiesData,
      isPending: false,
      success: true,
      message: "",
      error: "",
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return {
      activities: [],
      isPending: false,
      success: false,
      message: "",
      error: "Failed to fetch activities",
    };
  }
}

export async function deleteActivityServerAction(
  activityId: number
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const success = await ActivityQueries.deleteActivity(activityId, user.id);

    if (!success) {
      throw new Error("Failed to delete activity or activity not found");
    }

    revalidatePath("/activity/list");
  } catch (error) {
    console.error("Error deleting activity:", error);
    throw error;
  }
}
