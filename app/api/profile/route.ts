import { NextRequest, NextResponse } from "next/server";
import { ProfileQueries } from "@/lib/db/queries/profile";
import { ProfileUpdateData } from "@/lib/types/profile";
import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

// Helper function to get current user
async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const profile = await ProfileQueries.getProfileByUserId(user.id);

    return NextResponse.json({
      user,
      profile,
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Map snake_case to camelCase for Drizzle compatibility
    const profileData: ProfileUpdateData = {
      firstName: body.firstName || body.firstName,
      lastName: body.lastName || body.lastName,
      phone: body.phone,
      registrationNumber: body.registrationNumber || body.registrationNumber,
      role: body.role,
      isTherapeuticallyEndorsed: body.isTherapeuticallyEndorsed,
    };

    // Get current user first
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Upsert the profile (ensure required fields have defaults)
    const upsertData = {
      firstName: profileData.firstName || "",
      lastName: profileData.lastName || "",
      phone: profileData.phone || "",
      registrationNumber: profileData.registrationNumber || "",
      role: profileData.role || "optometrist",
      isTherapeuticallyEndorsed: profileData.isTherapeuticallyEndorsed ?? false,
    };

    const updatedProfile = await ProfileQueries.upsertProfile(
      user.id,
      upsertData
    );

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Create initial profile from user metadata
    const profileData = {
      firstName: user.user_metadata?.firstName || "",
      lastName: user.user_metadata?.lastName || "",
      phone: user.user_metadata?.phone || "",
      registrationNumber: "",
      role: user.user_metadata?.role || "optometrist",
    };

    const profile = await ProfileQueries.createProfile({
      userId: user.id,
      ...profileData,
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const deleted = await ProfileQueries.deleteProfile(user.id);

    if (!deleted) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
