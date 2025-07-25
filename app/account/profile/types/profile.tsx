import { ProfileData } from "@/lib/types/profile";

export type ProfileDataState = Omit<
  ProfileData,
  "createdAt" | "updatedAt" | "id"
> & {
  email?: string;
};

export type ActionState = {
  profile: ProfileDataState;
  message?: string;
  error?: string;
  isPending: boolean;
  success?: boolean;
};
