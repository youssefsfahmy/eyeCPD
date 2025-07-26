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
      evidenceFileUrl: null, // TODO: Implement file upload
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

export async function updateActivityServerAction(
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
    const activityId = parseInt(formData.get("id") as string);

    if (isNaN(activityId)) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Invalid activity ID",
      };
    }

    const activityData = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
      hours: formData.get("hours") as string,
      description: formData.get("description") as string,
      reflection: formData.get("reflection") as string,
      clinical: formData.get("clinical") === "on",
      nonClinical: formData.get("nonClinical") === "on",
      interactive: formData.get("interactive") === "on",
      therapeutic: formData.get("therapeutic") === "on",
      evidenceFileUrl: null, // TODO: Implement file upload
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

    const updatedActivity = await ActivityQueries.updateActivity(
      activityId,
      user.id,
      {
        name: activityData.name,
        date: activityData.date,
        hours: activityData.hours,
        description: activityData.description,
        reflection: activityData.reflection,
        clinical: activityData.clinical,
        nonClinical: activityData.nonClinical,
        interactive: activityData.interactive,
        therapeutic: activityData.therapeutic,
        evidenceFileUrl: activityData.evidenceFileUrl,
      }
    );

    if (!updatedActivity) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Failed to update activity or activity not found",
      };
    }

    revalidatePath("/activity/list");
    revalidatePath(`/activity/${activityId}`);

    return {
      activity: {
        id: updatedActivity.id,
        userId: updatedActivity.userId,
        clinical: updatedActivity.clinical,
        nonClinical: updatedActivity.nonClinical,
        interactive: updatedActivity.interactive,
        therapeutic: updatedActivity.therapeutic,
        name: updatedActivity.name,
        date: updatedActivity.date,
        hours: updatedActivity.hours,
        description: updatedActivity.description,
        reflection: updatedActivity.reflection,
        evidenceFileUrl: updatedActivity.evidenceFileUrl,
      },
      isPending: false,
      success: true,
      message: "Activity updated successfully",
      error: "",
    };
  } catch (error) {
    console.error("Error updating activity:", error);
    return {
      isPending: false,
      success: false,
      message: "",
      error: "Failed to update activity",
    };
  }
}
