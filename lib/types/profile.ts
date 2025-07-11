import { Profile, NewProfile } from "../db/schema";

// Re-export Drizzle types for compatibility
export type ProfileData = Profile;
export type ProfileCreateData = NewProfile;

// Update data type for partial updates
export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  registrationNumber?: string;
  role?: string;
  isTherapeuticallyEndorsed?: boolean;
}

// Legacy compatibility types (camelCase to snake_case mapping)
export interface LegacyProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  registrationNumber: string;
  role: string;
  userId: string;
  created_at?: string;
  updated_at?: string;
}

export interface LegacyProfileCreateData {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  registrationNumber: string;
  role: string;
}

export interface LegacyProfileUpdateData {
  firstName: string;
  lastName: string;
  phone: string;
  registrationNumber: string;
}
