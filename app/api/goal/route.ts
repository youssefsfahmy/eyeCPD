import { createClient } from "@/app/lib/supabase/server";
import { GoalQueries } from "@/lib/db/queries/goal";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();

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

    const newGoal = await GoalQueries.createGoal(goalData);

    revalidatePath("/goal");

    return NextResponse.json({
      success: true,
      message: "Goal created successfully",
      goal: {
        id: newGoal.id,
        userId: newGoal.userId,
        year: newGoal.year,
        title: newGoal.title,
        tags: newGoal.tags,
        clinical: newGoal.clinical,
        nonClinical: newGoal.nonClinical,
        interactive: newGoal.interactive,
        therapeutic: newGoal.therapeutic,
        targetHours: newGoal.targetHours,
        createdAt: newGoal.createdAt,
        updatedAt: newGoal.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
