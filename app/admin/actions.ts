"use server";

import { createClient } from "@/app/lib/supabase/server";
import { ProfileQueries } from "@/lib/db/queries/profile";
import { ProviderQueries } from "@/lib/db/queries/provider";
import { TagQueries } from "@/lib/db/queries/tag";
import { UserRole } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", user: null };
  }

  const profile = await ProfileQueries.getProfileByUserId(user.id);
  if (!profile?.roles?.includes(UserRole.ADMIN)) {
    return { error: "Unauthorized. Admin access required.", user: null };
  }

  return { error: null, user };
}

export async function createGlobalProviderAction(formData: FormData) {
  const { error } = await verifyAdmin();
  if (error) return { success: false, error };

  const name = formData.get("name") as string;
  const contactName = (formData.get("contactName") as string) || null;
  const providerType = (formData.get("providerType") as string) || null;
  const address = (formData.get("address") as string) || null;
  const state = (formData.get("state") as string) || null;
  const contactNumber = (formData.get("contactNumber") as string) || null;
  const contactEmail = (formData.get("contactEmail") as string) || null;

  if (!name?.trim()) {
    return { success: false, error: "Provider name is required." };
  }

  try {
    await ProviderQueries.createProvider({
      userId: null,
      name: name.trim(),
      contactName,
      providerType,
      address,
      state,
      contactNumber,
      contactEmail,
    });
    revalidatePath("/admin/providers");
    return { success: true };
  } catch (err) {
    console.error("Error creating provider:", err);
    return { success: false, error: "Failed to create provider." };
  }
}

export async function updateGlobalProviderAction(
  providerId: number,
  formData: FormData,
) {
  const { error } = await verifyAdmin();
  if (error) return { success: false, error };

  const name = formData.get("name") as string;
  const contactName = (formData.get("contactName") as string) || null;
  const providerType = (formData.get("providerType") as string) || null;
  const address = (formData.get("address") as string) || null;
  const state = (formData.get("state") as string) || null;
  const contactNumber = (formData.get("contactNumber") as string) || null;
  const contactEmail = (formData.get("contactEmail") as string) || null;

  if (!name?.trim()) {
    return { success: false, error: "Provider name is required." };
  }

  try {
    await ProviderQueries.updateProvider(providerId, {
      name: name.trim(),
      contactName,
      providerType,
      address,
      state,
      contactNumber,
      contactEmail,
    });
    revalidatePath("/admin/providers");
    return { success: true };
  } catch (err) {
    console.error("Error updating provider:", err);
    return { success: false, error: "Failed to update provider." };
  }
}

export async function createGlobalTagAction(formData: FormData) {
  const { error } = await verifyAdmin();
  if (error) return { success: false, error };

  const tag = formData.get("tag") as string;

  if (!tag?.trim()) {
    return { success: false, error: "Tag name is required." };
  }

  try {
    await TagQueries.createTag({
      userId: null,
      tag: tag.trim(),
    });
    revalidatePath("/admin/tags");
    return { success: true };
  } catch (err) {
    console.error("Error creating tag:", err);
    return { success: false, error: "Failed to create tag." };
  }
}
