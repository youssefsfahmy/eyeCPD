export interface GoalDataState {
  id: number;
  userId: string;
  year: string;
  title: string;
  tags: string[] | null;
  clinical: boolean;
  nonClinical: boolean;
  interactive: boolean;
  therapeutic: boolean;
  targetHours: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalActionState {
  goal?: GoalDataState;
  goals?: GoalDataState[];
  isPending: boolean;
  success: boolean;
  message: string;
  error: string;
}

export interface GoalFormData {
  year: string;
  title: string;
  tags: string[];
  description?: string;
  clinical: boolean;
  nonClinical: boolean;
  interactive: boolean;
  therapeutic: boolean;
  targetHours: string;
}
