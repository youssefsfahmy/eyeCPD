import { ActivityRecord } from "@/lib/db/schema";

export type ActivityDataState = Omit<
  ActivityRecord,
  "createdAt" | "updatedAt" | "id"
> & {
  id?: number;
};

export type ActivityActionState = {
  activity?: ActivityDataState;
  activities?: ActivityDataState[];
  message?: string;
  error?: string;
  isPending: boolean;
  success?: boolean;
};

export interface ActivityFormData {
  name: string;
  date: string;
  hours: string;
  description: string;
  reflection: string;
  clinical: boolean;
  nonClinical: boolean;
  interactive: boolean;
  therapeutic: boolean;
  evidenceFile?: File;
}
