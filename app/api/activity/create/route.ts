import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ActivityQueries } from "@/lib/db/queries/activity";
import { SupabaseStorage } from "@/lib/storage/supabase";
import { createClient } from "@/app/lib/supabase/server";
import { addTagsToActivity } from "../helper";
import { Tag } from "@/lib/db/schema";

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
      evidenceFileUrl: null, // Will be set after file upload
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

    // Step 1: Create the activity record first
    const newActivity = await ActivityQueries.createActivity(activityData);

    let fileUrl = null;

    // Step 2: Handle file upload if a file was provided
    if (file && file.size > 0) {
      try {
        // Use the new SupabaseStorage method for cleaner file handling
        const uploadResult = await SupabaseStorage.uploadActivityFile(
          file,
          newActivity.id
        );

        fileUrl = uploadResult.url;

        // Step 3: Update activity with file URL
        await ActivityQueries.updateActivity(newActivity.id, user.id, {
          evidenceFileUrl: fileUrl,
        });
      } catch (fileError) {
        console.error("Error during file upload:", fileError);
        // Delete the created activity since file upload failed
        await ActivityQueries.deleteActivity(newActivity.id, user.id);
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

    // Step 3: Associate tags with the activity
    if (formData.get("activityTags")) {
      const activityTags = JSON.parse(
        formData.get("activityTags") as string
      ) as Tag[];

      await addTagsToActivity(newActivity.id, activityTags, user.id);
    }
    // Revalidate cache
    revalidatePath("/activity/list");

    // Return success response with the created activity
    const activityResponse = await ActivityQueries.getActivityById(
      newActivity.id,
      user.id
    );

    return NextResponse.json({
      success: true,
      message: "Activity created successfully",
      activity: activityResponse,
    });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
