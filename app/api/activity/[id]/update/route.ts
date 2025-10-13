"use server";

import { createClient } from "@/app/lib/supabase/server";
import { ActivityQueries } from "@/lib/db/queries/activity";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { SupabaseStorage } from "@/lib/storage/supabase";
import { Tag } from "@/lib/db/schema";

import { addTagsToActivity } from "../../helper";

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

    const activityId = parseInt(id);
    if (isNaN(activityId)) {
      return NextResponse.json(
        { success: false, error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("evidenceFile") as File | null;

    // Extract form data
    const tagsString = formData.get("tags") as string;
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

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
      tags: tags,
      activityProvider: formData.get("activityProvider") as string,
      isDraft: formData.get("isDraft") === "true",
    };

    // Validation
    if (!activityData.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Activity name is required" },
        { status: 400 }
      );
    }

    if (!activityData.date) {
      return NextResponse.json(
        { success: false, error: "Activity date is required" },
        { status: 400 }
      );
    }

    const hours = parseFloat(activityData.hours);
    if (isNaN(hours) || hours <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid hours are required" },
        { status: 400 }
      );
    }

    if (!activityData.description.trim()) {
      return NextResponse.json(
        { success: false, error: "Description is required" },
        { status: 400 }
      );
    }

    if (!activityData.reflection.trim()) {
      return NextResponse.json(
        { success: false, error: "Reflection is required" },
        { status: 400 }
      );
    }

    // At least one activity type must be selected
    if (
      !activityData.clinical &&
      !activityData.nonClinical &&
      !activityData.interactive &&
      !activityData.therapeutic
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one activity type must be selected",
        },
        { status: 400 }
      );
    }

    // Step 1: Update the activity record
    const updatedActivity = await ActivityQueries.updateActivity(
      activityId,
      user.id,
      activityData
    );

    if (!updatedActivity) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update activity or activity not found",
        },
        { status: 404 }
      );
    }

    let fileUrl = updatedActivity.evidenceFileUrl;

    // Step 2: Handle file upload if a new file was provided
    if (file && file.size > 0) {
      try {
        // Use the new method with old file path for proper cleanup
        const { url } = await SupabaseStorage.uploadActivityFile(
          file,
          activityId,
          updatedActivity.evidenceFileUrl || undefined // Pass old file URL for cleanup
        );

        fileUrl = url;
        await ActivityQueries.updateActivity(activityId, user.id, {
          evidenceFileUrl: fileUrl,
        });
      } catch (fileError) {
        console.error("Error during file upload:", fileError);
        return NextResponse.json(
          {
            success: false,
            error:
              fileError instanceof Error
                ? fileError.message
                : "Failed to upload file",
          },
          { status: 500 }
        );
      }
    }

    // Step 3: Update activity tags

    //add new activity tags (no id)
    if (formData.get("activityTags")) {
      const activityTags = JSON.parse(
        formData.get("activityTags") as string
      ) as Tag[];

      await addTagsToActivity(activityId, activityTags);
    }

    // Revalidate cache
    revalidatePath("/activity/list");
    revalidatePath(`/activity/${activityId}`);

    // Return success response with the updated activity
    const activityResponse = {
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
      evidenceFileUrl: fileUrl,
      activityProvider: updatedActivity.activityProvider,
      isDraft: updatedActivity.isDraft,
    };

    return NextResponse.json({
      success: true,
      message: "Activity updated successfully",
      activity: activityResponse,
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update activity" },
      { status: 500 }
    );
  }
}
