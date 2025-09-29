"use server";

import { createClient } from "@/app/lib/supabase/server";
import { GoalQueries } from "@/lib/db/queries/goal";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const goalId = parseInt(id);
    if (isNaN(goalId)) {
      return NextResponse.json(
        { success: false, error: "Invalid goal ID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    // Extract form data
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
      clinical: formData.get("clinical") === "true",
      nonClinical: formData.get("nonClinical") === "true",
      interactive: formData.get("interactive") === "true",
      therapeutic: formData.get("therapeutic") === "true",
      targetHours: formData.get("targetHours")
        ? (formData.get("targetHours") as string)
        : null,
    };

    // Validation
    if (!goalData.year.trim()) {
      return NextResponse.json(
        { success: false, error: "Year is required" },
        { status: 400 }
      );
    }

    if (!goalData.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Goal title is required" },
        { status: 400 }
      );
    }

    // Validate that at least one goal type is selected
    if (
      !goalData.clinical &&
      !goalData.nonClinical &&
      !goalData.interactive &&
      !goalData.therapeutic
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one goal type must be selected",
        },
        { status: 400 }
      );
    }

    // Validate target hours if provided
    if (goalData.targetHours) {
      const hours = parseFloat(goalData.targetHours);
      if (isNaN(hours) || hours <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Target hours must be a positive number",
          },
          { status: 400 }
        );
      }
    }

    // Update the goal record
    const updatedGoal = await GoalQueries.updateGoal(goalId, user.id, goalData);

    if (!updatedGoal) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update goal or goal not found",
        },
        { status: 404 }
      );
    }

    // Revalidate cache
    revalidatePath("/goal/list");
    revalidatePath(`/goal/${goalId}`);

    // Return success response with the updated goal
    const goalResponse = {
      id: updatedGoal.id,
      userId: updatedGoal.userId,
      year: updatedGoal.year,
      title: updatedGoal.title,
      tags: updatedGoal.tags || [],
      clinical: updatedGoal.clinical,
      nonClinical: updatedGoal.nonClinical,
      interactive: updatedGoal.interactive,
      therapeutic: updatedGoal.therapeutic,
      targetHours: updatedGoal.targetHours,
      createdAt: updatedGoal.createdAt,
      updatedAt: updatedGoal.updatedAt,
    };

    return NextResponse.json({
      success: true,
      message: "Goal updated successfully",
      goal: goalResponse,
    });
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update goal" },
      { status: 500 }
    );
  }
}