import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CPDCycle } from "./types/generic";
import { Profile, UserRole } from "./db/schema";
import { User } from "@supabase/supabase-js";

export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  authRequired: boolean;
  roles: string[];
}

export function getVisibleNavItems(
  items: NavItem[],
  user: User | null | undefined,
  profile: Profile | null | undefined,
): NavItem[] {
  return items.filter((item) => {
    if (item.authRequired && !user) return false;
    if (
      item.authRequired &&
      !item.roles.some((role) => profile?.roles.includes(role))
    )
      return false;
    return true;
  });
}

export function getActiveNavItems(
  pathname: string,
  user: User | null | undefined,
  profile: Profile | null | undefined,
  navigationItems: NavItem[],
  adminNavigationItems: NavItem[],
): NavItem[] {
  const isAdminMode = pathname.startsWith("/admin");
  const isAdmin = !!user && !!profile?.roles?.includes(UserRole.ADMIN);
  const rawItems =
    isAdminMode && isAdmin ? adminNavigationItems : navigationItems;
  return getVisibleNavItems(rawItems, user, profile);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Utility function to get current CPD cycle (can be exported for use in other components)
export const getCurrentCPDCycle = (): CPDCycle => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentCycleStartYear =
    currentMonth === 11 ? currentYear : currentYear - 1;
  const currentCycleEndYear = currentCycleStartYear + 1;

  return {
    startDate: new Date(currentCycleStartYear, 11, 1),
    endDate: new Date(currentCycleEndYear, 10, 30),
    label: `${currentCycleStartYear}/${currentCycleEndYear
      .toString()
      .slice(-2)}`,
    value: `${currentCycleStartYear}-${currentCycleEndYear}`,
    isCurrent: true,
    year: currentCycleEndYear.toString(),
  };
};

// Utility function to get cycle from URL parameter or return current cycle
export const getCycleFromUrlOrCurrent = (
  cycleParam: string | null,
): CPDCycle => {
  if (cycleParam) {
    const [startYear, endYear] = cycleParam.split("-").map(Number);
    if (startYear && endYear && endYear === startYear + 1) {
      const currentCycle = getCurrentCPDCycle();

      return {
        startDate: new Date(startYear, 11, 1),
        endDate: new Date(endYear, 10, 30),
        label: `${startYear}/${endYear.toString().slice(-2)}`,
        value: cycleParam,
        isCurrent: cycleParam === currentCycle.value,
        year: endYear.toString(),
      };
    }
  }

  return getCurrentCPDCycle();
};
