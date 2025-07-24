"use server";

import { createClient } from "@/app/lib/supabase/server";
import { ProfileQueries } from "@/lib/db/queries/profile";
import { User, type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

const verifyProfileCreation = async (user: User, role = "optometrist") => {
  const profile = await ProfileQueries.getProfileByUserId(user.id);
  if (!profile) {
    await ProfileQueries.createProfile({
      userId: user.id,
      firstName: user?.user_metadata?.first_name || "",
      lastName: user?.user_metadata?.last_name || "",
      phone: user.phone || "",
      registrationNumber: "",
      role,
      isTherapeuticallyEndorsed: false,
    });
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/opt";

  const supabase = await createClient();

  // Handle OAuth callback (Google sign-in/sign-up)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // check if the user has profile if not create emty one
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await verifyProfileCreation(user!);

      // redirect user to protected area after successful OAuth
      redirect(next);
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/error?error=${error?.message}`);
    }
  }

  // Handle email OTP verification
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await verifyProfileCreation(user!);
      redirect(next);
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/error?error=${error?.message}`);
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/error?error=No valid authentication parameters found`);
}
