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
    const activities = await ActivityQueries.getActivitiesByUserId(user.id);

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
      tags: activity.tags || [],
      activityProvider: activity.activityProvider,
      isDraft: activity.isDraft,
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

export async function createActivityServerAction(
  prevState: ActivityActionState,
  formData: FormData
): Promise<ActivityActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isPending: false,
      success: false,
      message: "",
      error: "User not authenticated",
    };
  }

  try {
    const tagsString = formData.get("tags") as string;
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    const activityData = {
      userId: user.id,
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      hours: formData.get("hours") as string,
      description: formData.get("description") as string,
      reflection: formData.get("reflection") as string,
      clinical: formData.get("clinical") === "on",
      nonClinical: formData.get("nonClinical") === "on",
      interactive: formData.get("interactive") === "on",
      therapeutic: formData.get("therapeutic") === "on",
      evidenceFileUrl: null, // File will be uploaded separately
      tags: tags,
      activityProvider: formData.get("activityProvider") as string,
      isDraft: formData.get("isDraft") === "true",
    };

    // Validation
    if (!activityData.name.trim()) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Activity name is required",
      };
    }

    if (!activityData.date) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Activity date is required",
      };
    }

    const hours = parseFloat(activityData.hours);
    if (isNaN(hours) || hours <= 0) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Valid hours are required",
      };
    }

    if (!activityData.description.trim()) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Description is required",
      };
    }

    if (!activityData.reflection.trim()) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Reflection is required",
      };
    }

    // At least one activity type must be selected
    if (
      !activityData.clinical &&
      !activityData.nonClinical &&
      !activityData.interactive &&
      !activityData.therapeutic
    ) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "At least one activity type must be selected",
      };
    }
    const newActivity = await ActivityQueries.createActivity(activityData);

    revalidatePath("/activity/list");

    return {
      activity: {
        id: newActivity.id,
        userId: newActivity.userId,
        clinical: newActivity.clinical,
        nonClinical: newActivity.nonClinical,
        interactive: newActivity.interactive,
        therapeutic: newActivity.therapeutic,
        name: newActivity.name,
        date: newActivity.date,
        hours: newActivity.hours,
        description: newActivity.description,
        reflection: newActivity.reflection,
        evidenceFileUrl: newActivity.evidenceFileUrl,
        tags: newActivity.tags || [],
        activityProvider: newActivity.activityProvider,
        isDraft: newActivity.isDraft,
      },
      isPending: false,
      success: true,
      message: "Activity created successfully",
      error: "",
    };
  } catch (error) {
    console.error("Error creating activity:", error);
    return {
      isPending: false,
      success: false,
      message: "",
      error: "Failed to create activity",
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
