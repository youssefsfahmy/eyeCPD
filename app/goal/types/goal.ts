import { GoalWithTags } from "@/lib/db/schema";

export interface GoalActionState {
  goal?: GoalWithTags;
  goals?: GoalWithTags[];
  isPending: boolean;
  success: boolean;
  message: string;
  error: string;
}

export interface GoalFormData {
  year: string;
  title: string;
  description?: string;
  clinical: boolean;
  nonClinical: boolean;
  interactive: boolean;
  therapeutic: boolean;
  targetHours: string;
}
