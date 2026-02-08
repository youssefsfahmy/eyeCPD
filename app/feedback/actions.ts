"use server";

import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";
import { FeedbackQueries } from "@/lib/db/queries/feedback";
import { revalidatePath } from "next/cache";

export async function submitFeedback(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const page = formData.get("page") as string;
  const isPositive = formData.get("isPositive") === "true";
  const details = formData.get("details") as string;

  if (!page || !details) {
    throw new Error("Page and details are required");
  }

  try {
    await FeedbackQueries.createFeedback({
      userId: user.id,
      page,
      isPositive,
      details,
    });

    // invalidate cache for feedback list page to show new feedback immediately
    revalidatePath("/feedback/list");

    return { success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw new Error("Failed to submit feedback");
  }
}
