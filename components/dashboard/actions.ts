// app/lib/dashboard.ts
import { createClient } from "@/app/lib/supabase/server";
import { ActivityQueries } from "@/lib/db/queries/activity";

export interface CPDSummary {
  totalHours: number;
  requiredHours: number;
  remainingHours: number;
  complianceStatus: "On Track" | "At Risk" | "Non-compliant";
  daysLeftInCycle: number;
  cycleEndDate: Date;
}

export interface ActivityCompliance {
  compliantCount: number;
  nonCompliantCount: number;
  nonCompliantReasons: {
    missingReflection: number;
    noEvidence: number;
    wrongCategory: number;
    other: number;
  };
}

export interface CategoryBreakdown {
  clinical: number;
  nonClinical: number;
}
export interface LearningFormatBreakdown {
  interactive: number;
  selfPaced: number;
}
export interface MonthlyProgress {
  month: string;
  hours: number;
}

export interface RecentActivity {
  id: number;
  name: string;
  date: string;
  hours: number;
  clinical: boolean;
  nonClinical: boolean;
  interactive: boolean;
  isDraft: boolean;
  reflection: string | null;
  evidenceFileUrl: string | null;
}

export interface DashboardData {
  summary: CPDSummary;
  compliance: ActivityCompliance;
  categories: CategoryBreakdown;
  formats: LearningFormatBreakdown;
  monthly: MonthlyProgress[];
  recentActivities: RecentActivity[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // SINGLE query for all activities
  // ⚠️ Ensure ActivityQueries.getActivitiesByUserId selects only needed columns:
  // id, isDraft, hours, reflection, evidenceFileUrl, clinical, nonClinical, interactive, date
  const activities = await ActivityQueries.getActivitiesByUserId(user.id);

  // Helpers
  const now = new Date();
  const cycleStart = new Date(now.getFullYear(), 0, 1);
  const cycleEnd = new Date(now.getFullYear(), 11, 31);
  const totalDays = Math.ceil(
    (cycleEnd.getTime() - cycleStart.getTime()) / 86400000
  );
  const daysPassed = Math.ceil(
    (now.getTime() - cycleStart.getTime()) / 86400000
  );
  const daysLeft = Math.max(0, totalDays - daysPassed);
  const requiredHours = 80;
  const expectedByNow = (daysPassed / totalDays) * requiredHours;

  // Accumulators
  let totalHours = 0;
  let compliantCount = 0;
  let nonCompliantCount = 0;
  const nonCompliantReasons = {
    missingReflection: 0,
    noEvidence: 0,
    wrongCategory: 0,
    other: 0,
  };
  let clinical = 0,
    nonClinical = 0;
  let interactive = 0,
    selfPaced = 0;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ] as const;
  const monthlyMap: Record<(typeof months)[number], number> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.fromEntries(months.map((m) => [m, 0])) as any;

  for (const a of activities) {
    if (a.isDraft) continue;

    const hours = Number(a.hours || 0);
    totalHours += hours;

    // Category breakdown
    if (a.clinical) clinical += hours;
    if (a.nonClinical) nonClinical += hours;

    // Format breakdown
    if (a.interactive) interactive += hours;
    else selfPaced += hours;

    // Monthly
    const d = new Date(a.date);
    const m = months[d.getMonth()];
    monthlyMap[m] += hours;

    // Compliance per-activity
    let isCompliant = true;
    if (!a.reflection || a.reflection.trim().length < 50) {
      nonCompliantReasons.missingReflection++;
      isCompliant = false;
    }
    if (!a.evidenceFileUrl) {
      nonCompliantReasons.noEvidence++;
      isCompliant = false;
    }
    if (!a.clinical && !a.nonClinical) {
      nonCompliantReasons.wrongCategory++;
      isCompliant = false;
    }
    if (isCompliant) compliantCount++;
    else nonCompliantCount++;
  }

  // Overall compliance status
  let complianceStatus: CPDSummary["complianceStatus"];
  if (totalHours >= requiredHours) {
    complianceStatus = "On Track";
  } else if (totalHours >= expectedByNow * 0.8) {
    complianceStatus = "On Track";
  } else if (totalHours >= expectedByNow * 0.5) {
    complianceStatus = "At Risk";
  } else {
    complianceStatus = "Non-compliant";
  }

  // Get recent activities (limit to 5 for dashboard)
  const recentActivities = activities
    .filter((a) => !a.isDraft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      name: a.name,
      date: a.date,
      hours: Number(a.hours || 0),
      clinical: a.clinical,
      nonClinical: a.nonClinical,
      interactive: a.interactive,
      isDraft: a.isDraft,
      reflection: a.reflection,
      evidenceFileUrl: a.evidenceFileUrl,
    }));

  return {
    summary: {
      totalHours,
      requiredHours,
      remainingHours: Math.max(0, requiredHours - totalHours),
      complianceStatus,
      daysLeftInCycle: daysLeft,
      cycleEndDate: cycleEnd,
    },
    compliance: {
      compliantCount,
      nonCompliantCount,
      nonCompliantReasons,
    },
    categories: { clinical, nonClinical },
    formats: { interactive, selfPaced },
    monthly: months.map((m) => ({ month: m, hours: monthlyMap[m] })),
    recentActivities,
  };
}
