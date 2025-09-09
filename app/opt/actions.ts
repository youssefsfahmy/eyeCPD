import { createClient } from "@/app/lib/supabase/server";
import { ActivityQueries } from "@/lib/db/queries/activity";

export interface CPDSummary {
  totalHours: number;
  requiredHours: number;
  remainingHours: number;
  complianceStatus: 'On Track' | 'At Risk' | 'Non-compliant';
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

export async function getCPDSummary(): Promise<CPDSummary> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const activities = await ActivityQueries.getActivitiesByUserId(user.id);
    
    // Calculate total hours
    const totalHours = activities.reduce((sum, activity) => {
      if (!activity.isDraft) {
        return sum + Number(activity.hours || 0);
      }
      return sum;
    }, 0);

    const requiredHours = 80; // Standard CPD requirement
    const remainingHours = Math.max(0, requiredHours - totalHours);
    
    // Calculate compliance status
    const currentDate = new Date();
    const cycleStartDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st
    const cycleEndDate = new Date(currentDate.getFullYear(), 11, 31); // December 31st
    const totalDaysInCycle = Math.ceil((cycleEndDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((currentDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeftInCycle = Math.max(0, totalDaysInCycle - daysPassed);
    
    const expectedHoursByNow = (daysPassed / totalDaysInCycle) * requiredHours;
    
    let complianceStatus: 'On Track' | 'At Risk' | 'Non-compliant';
    if (totalHours >= requiredHours) {
      complianceStatus = 'On Track';
    } else if (totalHours >= expectedHoursByNow * 0.8) {
      complianceStatus = 'On Track';
    } else if (totalHours >= expectedHoursByNow * 0.5) {
      complianceStatus = 'At Risk';
    } else {
      complianceStatus = 'Non-compliant';
    }

    return {
      totalHours,
      requiredHours,
      remainingHours,
      complianceStatus,
      daysLeftInCycle,
      cycleEndDate,
    };
  } catch (error) {
    console.error('Error fetching CPD summary:', error);
    throw new Error('Failed to fetch CPD summary');
  }
}

export async function getActivityCompliance(): Promise<ActivityCompliance> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const activities = await ActivityQueries.getActivitiesByUserId(user.id);
    
    let compliantCount = 0;
    let nonCompliantCount = 0;
    const nonCompliantReasons = {
      missingReflection: 0,
      noEvidence: 0,
      wrongCategory: 0,
      other: 0,
    };

    activities.forEach(activity => {
      if (activity.isDraft) return;

      let isCompliant = true;
      
      // Check for missing reflection
      if (!activity.reflection || activity.reflection.trim().length < 50) {
        nonCompliantReasons.missingReflection++;
        isCompliant = false;
      }
      
      // Check for evidence (file upload)
      if (!activity.evidenceFileUrl) {
        nonCompliantReasons.noEvidence++;
        isCompliant = false;
      }
      
      // Check category requirements (simplified logic)
      if (!activity.clinical && !activity.nonClinical) {
        nonCompliantReasons.wrongCategory++;
        isCompliant = false;
      }

      if (isCompliant) {
        compliantCount++;
      } else {
        nonCompliantCount++;
      }
    });

    return {
      compliantCount,
      nonCompliantCount,
      nonCompliantReasons,
    };
  } catch (error) {
    console.error('Error fetching activity compliance:', error);
    throw new Error('Failed to fetch activity compliance');
  }
}

export async function getCategoryBreakdown(): Promise<CategoryBreakdown> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const activities = await ActivityQueries.getActivitiesByUserId(user.id);
    
    let clinical = 0;
    let nonClinical = 0;

    activities.forEach(activity => {
      if (activity.isDraft) return;
      
      const hours = Number(activity.hours || 0);
      if (activity.clinical) {
        clinical += hours;
      }
      if (activity.nonClinical) {
        nonClinical += hours;
      }
    });

    return { clinical, nonClinical };
  } catch (error) {
    console.error('Error fetching category breakdown:', error);
    throw new Error('Failed to fetch category breakdown');
  }
}

export async function getLearningFormatBreakdown(): Promise<LearningFormatBreakdown> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const activities = await ActivityQueries.getActivitiesByUserId(user.id);
    
    let interactive = 0;
    let selfPaced = 0;

    activities.forEach(activity => {
      if (activity.isDraft) return;
      
      const hours = Number(activity.hours || 0);
      if (activity.interactive) {
        interactive += hours;
      } else {
        selfPaced += hours;
      }
    });

    return { interactive, selfPaced };
  } catch (error) {
    console.error('Error fetching learning format breakdown:', error);
    throw new Error('Failed to fetch learning format breakdown');
  }
}

export async function getMonthlyProgress(): Promise<MonthlyProgress[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const activities = await ActivityQueries.getActivitiesByUserId(user.id);
    
    const monthlyData: { [key: string]: number } = {};
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Initialize all months
    months.forEach(month => {
      monthlyData[month] = 0;
    });

    activities.forEach(activity => {
      if (activity.isDraft) return;
      
      // Use the activity date instead of completedAt
      const activityDate = new Date(activity.date);
      const month = months[activityDate.getMonth()];
      const hours = Number(activity.hours || 0);
      
      monthlyData[month] += hours;
    });

    return months.map(month => ({
      month,
      hours: monthlyData[month],
    }));
  } catch (error) {
    console.error('Error fetching monthly progress:', error);
    throw new Error('Failed to fetch monthly progress');
  }
}
