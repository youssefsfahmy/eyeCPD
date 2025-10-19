import { createClient } from "@/app/lib/supabase/server";
import { GoalQueries } from "@/lib/db/queries/goal";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Tag } from "@/lib/db/schema";
import { TagQueries } from "@/lib/db/queries/tag";
import { GoalTagQueries } from "@/lib/db/queries/goalTag";

// Helper function to add tags to goal (similar to addTagsToActivity)
const addTagsToGoal = async (
  goalId: number,
  tags: Tag[],
  userId: string
): Promise<void> => {
  const tagsToBeLinked = [] as Tag[];

  for (const tag of tags) {
    if (tag.id != -1) {
      // existing tag
      tagsToBeLinked.push(tag);
    } else {
      // new tag - create it
      const createdTag = await TagQueries.createTag({
        userId: userId,
        tag: tag.tag,
      });
      tagsToBeLinked.push(createdTag);
    }
  }
  await GoalTagQueries.unlinkTagsFromGoal(goalId);
  await GoalTagQueries.linkTagsToGoal(goalId, tagsToBeLinked);
};

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

    const goalData = {
      userId: user.id,
      year: formData.get("year") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
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

    // Handle goal tags if provided
    if (formData.get("goalTags")) {
      const goalTags = JSON.parse(formData.get("goalTags") as string) as Tag[];
      await addTagsToGoal(newGoal.id, goalTags, user.id);
    }

    const updatedGoal = await GoalQueries.getGoalById(newGoal.id, user.id);

    revalidatePath("/goal");

    return NextResponse.json({
      success: true,
      message: "Goal created successfully",
      goal: updatedGoal,
    });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
