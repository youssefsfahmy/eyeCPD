"use server";

import { ProfileQueries } from "@/lib/db/queries/profile";
import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionState, ProfileDataState } from "../types/profile";

export async function getProfileServerAction(): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  //   if (!user) return null;
  const profile = await ProfileQueries.getProfileByUserId(user!.id);
  const profileData: ProfileDataState = {
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    phone: profile?.phone || "",
    registrationNumber: profile?.registrationNumber || "",
    role: profile?.role || "",
    userId: profile?.userId || "",
    isTherapeuticallyEndorsed: profile?.isTherapeuticallyEndorsed || false,
  };

  return {
    profile: profileData,
    isPending: false,
    success: false,
    message: "",
    error: "",
  };
}

export async function createProfileServerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const dataToIpdate = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    phone: formData.get("phone") as string,
    registrationNumber: formData.get("registrationNumber") as string,
    userId: prevState.profile.userId,
    isTherapeuticallyEndorsed:
      formData.get("isTherapeuticallyEndorsed") === "true",
  };
  const newprofile = await ProfileQueries.updateProfile(
    prevState.profile.userId,
    dataToIpdate
  );

  if (!newprofile) {
    return {
      profile: prevState!.profile,
      isPending: false,
      success: false,
      message: "",
      error: "Failed to update profile",
    };
  }

  const newProfileData: ProfileDataState = {
    firstName: newprofile.firstName,
    lastName: newprofile.lastName,
    phone: newprofile.phone,
    registrationNumber: newprofile.registrationNumber,
    role: newprofile.role,
    userId: newprofile.userId,
    isTherapeuticallyEndorsed: newprofile.isTherapeuticallyEndorsed,
  };

  revalidatePath("/account/profile");
  return {
    profile: newProfileData,
    isPending: false,
    success: true,
    message: "Profile updated successfully",
    error: "",
  };
}
