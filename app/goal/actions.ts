"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { GoalQueries } from "@/lib/db/queries/goal";
import { GoalActionState } from "./types/goal";

export async function getGoalsServerAction(): Promise<GoalActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      goals: [],
      isPending: false,
      success: false,
      message: "",
      error: "User not authenticated",
    };
  }

  try {
    const goals = await GoalQueries.getGoalsByUserId(user.id);

    return {
      goals: goals,
      isPending: false,
      success: true,
      message: "",
      error: "",
    };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return {
      goals: [],
      isPending: false,
      success: false,
      message: "",
      error: "Failed to fetch goals",
    };
  }
}

export async function createGoalServerAction(
  prevState: GoalActionState,
  formData: FormData
): Promise<GoalActionState> {
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

    const goalData = {
      userId: user.id,
      year: formData.get("year") as string,
      title: formData.get("title") as string,
      tags: tags,
      clinical: formData.get("clinical") === "on",
      nonClinical: formData.get("nonClinical") === "on",
      interactive: formData.get("interactive") === "on",
      therapeutic: formData.get("therapeutic") === "on",
      targetHours: formData.get("targetHours")
        ? (formData.get("targetHours") as string)
        : null,
    };

    // Validation
    if (!goalData.year.trim()) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Year is required",
      };
    }

    if (!goalData.title.trim()) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Goal title is required",
      };
    }

    // Validate that at least one goal type is selected
    if (
      !goalData.clinical &&
      !goalData.nonClinical &&
      !goalData.interactive &&
      !goalData.therapeutic
    ) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "At least one goal type must be selected",
      };
    }

    // Validate target hours if provided
    if (goalData.targetHours) {
      const hours = parseFloat(goalData.targetHours);
      if (isNaN(hours) || hours <= 0) {
        return {
          isPending: false,
          success: false,
          message: "",
          error: "Target hours must be a positive number",
        };
      }
    }

    const goal = await GoalQueries.createGoal(goalData);
    const newGoal = await GoalQueries.getGoalById(goal.id, user.id);

    revalidatePath("/goal");

    return {
      goal: newGoal,
      isPending: false,
      success: true,
      message: "Goal created successfully",
      error: "",
    };
  } catch (error) {
    console.error("Error creating goal:", error);
    return {
      isPending: false,
      success: false,
      message: "",
      error: "Failed to create goal",
    };
  }
}

export async function deleteGoalServerAction(goalId: number): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const success = await GoalQueries.deleteGoal(goalId, user.id);

    if (!success) {
      throw new Error("Failed to delete goal or goal not found");
    }

    revalidatePath("/goal");
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw error;
  }
}

export async function updateGoalServerAction(
  goalId: number,
  prevState: GoalActionState,
  formData: FormData
): Promise<GoalActionState> {
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

    const goalData = {
      year: formData.get("year") as string,
      title: formData.get("title") as string,
      tags: tags,
      clinical: formData.get("clinical") === "on",
      nonClinical: formData.get("nonClinical") === "on",
      interactive: formData.get("interactive") === "on",
      therapeutic: formData.get("therapeutic") === "on",
      targetHours: formData.get("targetHours")
        ? (formData.get("targetHours") as string)
        : null,
    };

    // Validation
    if (!goalData.year.trim()) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Year is required",
      };
    }

    if (!goalData.title.trim()) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Goal title is required",
      };
    }

    // Validate that at least one goal type is selected
    if (
      !goalData.clinical &&
      !goalData.nonClinical &&
      !goalData.interactive &&
      !goalData.therapeutic
    ) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "At least one goal type must be selected",
      };
    }

    // Validate target hours if provided
    if (goalData.targetHours) {
      const hours = parseFloat(goalData.targetHours);
      if (isNaN(hours) || hours <= 0) {
        return {
          isPending: false,
          success: false,
          message: "",
          error: "Target hours must be a positive number",
        };
      }
    }

    const updatedGoal = await GoalQueries.updateGoal(goalId, user.id, goalData);

    if (!updatedGoal) {
      return {
        isPending: false,
        success: false,
        message: "",
        error: "Goal not found or unauthorized",
      };
    }
    const newGoal = await GoalQueries.getGoalById(updatedGoal.id, user.id);

    revalidatePath("/goal");

    return {
      goal: newGoal,
      isPending: false,
      success: true,
      message: "Goal updated successfully",
      error: "",
    };
  } catch (error) {
    console.error("Error updating goal:", error);
    return {
      isPending: false,
      success: false,
      message: "",
      error: "Failed to update goal",
    };
  }
}

export async function createGoal(formData: FormData) {
  try {
    const response = await fetch("/api/goal/create", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create goal");
    }

    return result;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw error;
  }
}
