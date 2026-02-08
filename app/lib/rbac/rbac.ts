import { defaultRouteAuthConfig } from "./rbac-rules";
import { SupabaseClaimsResult } from "../supabase/middlewares/types";
import { UserRole, SubscriptionStatus } from "@/lib/db/schema";

// Define the structure for authorization rules
export interface AuthorizationRule {
  roles: UserRole[];
  subscriptionTypes?: string[]; // Plan names
  subscriptionStatuses?: SubscriptionStatus[];
  requiresActiveSubscription?: boolean;
}

// Define authorization rules for different URL patterns
export interface RouteAuthConfig {
  [urlPattern: string]: AuthorizationRule;
}

// Define the structure for authorization result
export interface AuthorizationResult {
  isAuthorized: boolean;
  redirectUrl?: string;
  message?: string;
  reason?:
    | "no_rules"
    | "invalid_role"
    | "inactive_subscription"
    | "invalid_subscription_status"
    | "invalid_subscription_type"
    | "incomplete_profile";
}

export class RoleBasedAccessControl {
  private claims: SupabaseClaimsResult;
  private routeConfig: RouteAuthConfig;

  constructor(
    claims: SupabaseClaimsResult,
    routeConfig: RouteAuthConfig = defaultRouteAuthConfig,
  ) {
    this.claims = claims;
    this.routeConfig = routeConfig;
  }

  /**
   * Check if the user is authorized to access a specific URL
   * @param url - The URL to check authorization for
   * @param customRules - Optional custom authorization rules to override defaults
   * @returns AuthorizationResult with authorization status, redirect URL, and message
   */
  isAuthorized(
    url: string,
    customRules?: AuthorizationRule,
  ): AuthorizationResult {
    if (url.includes("/error")) {
      return {
        isAuthorized: true,
        message: "Access granted to error page",
      };
    }
    const rules = customRules || this.findMatchingRule(url);

    if (!rules) {
      console.log("No authorization rules found for URL:", url);
      return {
        isAuthorized: false,
        redirectUrl:
          "/error?error=Access denied. No authorization rules found for this resource.",
        message:
          "Access denied. No authorization rules found for this resource.",
        reason: "no_rules",
      };
    }

    // Check role authorization
    if (!this.hasRequiredRole(rules.roles)) {
      console.log(
        "Access denied for user:",
        this.getUserInfo(),
        "to URL:",
        url,
      );

      const userRoles = this.claims.profile?.roles || [];
      const requiredRoles = rules.roles.join(", ");

      return {
        isAuthorized: false,
        redirectUrl: this.getRedirectUrlForRole(
          null,
          `Access denied. Required roles: ${requiredRoles}. Your roles: ${userRoles.join(", ")}`,
        ),
        message: `Access denied. Required roles: ${requiredRoles}. Your roles: ${userRoles.join(", ")}`,
        reason: "invalid_role",
      };
    }

    // Check if profile is complete (skip for profile completion routes)
    if (
      !url.includes("/profile") &&
      !url.includes("/auth") &&
      !this.hasCompleteProfile()
    ) {
      console.log("claims", this.claims);
      console.log(
        "Access denied for user:",
        this.getUserInfo(),
        "due to incomplete profile",
      );

      const missingFields = this.getMissingProfileFields();

      return {
        isAuthorized: false,
        redirectUrl: "/auth/complete-profile",
        message: `Please complete your profile. Missing fields: ${missingFields.join(
          ", ",
        )}`,
        reason: "incomplete_profile",
      };
    }

    // Check subscription requirements
    if (rules.requiresActiveSubscription && !this.hasActiveSubscription()) {
      console.log(
        "Access denied for user:",
        this.getUserInfo(),
        "due to missing active subscription",
      );

      return {
        isAuthorized: false,
        redirectUrl:
          "/error?error=Access denied. An active subscription is required to access this resource.",
        message:
          "Access denied. An active subscription is required to access this resource.",
        reason: "inactive_subscription",
      };
    }

    // Check subscription status requirements
    if (
      rules.subscriptionStatuses &&
      !this.hasValidSubscriptionStatus(rules.subscriptionStatuses)
    ) {
      console.log(
        "Access denied for user:",
        this.getUserInfo(),
        "due to invalid subscription status",
      );

      const requiredStatuses = rules.subscriptionStatuses.join(", ");
      const currentStatus = this.claims.subscription?.status;

      return {
        isAuthorized: false,
        redirectUrl: `/error?error=Access denied. Required subscription status: ${requiredStatuses}. Current status: ${currentStatus}`,
        message: `Access denied. Required subscription status: ${requiredStatuses}. Current status: ${currentStatus}`,
        reason: "invalid_subscription_status",
      };
    }

    // Check subscription type/plan requirements
    if (
      rules.subscriptionTypes &&
      !this.hasValidSubscriptionType(rules.subscriptionTypes)
    ) {
      console.log(
        "Access denied for user:",
        this.getUserInfo(),
        "due to invalid subscription type",
      );

      const requiredTypes = rules.subscriptionTypes.join(", ");
      const currentType = this.claims.subscription?.plan_name || "none";

      return {
        isAuthorized: false,
        redirectUrl: `/error?error=Access denied. Required subscription plan: ${requiredTypes}. Current plan: ${currentType}`,
        message: `Access denied. Required subscription plan: ${requiredTypes}. Current plan: ${currentType}`,
        reason: "invalid_subscription_type",
      };
    }

    return {
      isAuthorized: true,
      message: "Access granted",
    };
  }

  /**
   * Legacy method for backward compatibility - returns just the boolean
   * @deprecated Use isAuthorized() instead which returns full AuthorizationResult
   */
  canAccess(url: string, customRules?: AuthorizationRule): boolean {
    return this.isAuthorized(url, customRules).isAuthorized;
  }

  /**
   * Check if user has any of the required roles
   */
  private hasRequiredRole(requiredRoles: UserRole[]): boolean {
    const userRoles = this.claims.profile?.roles || [];
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  /**
   * Check if user has an active subscription
   */
  private hasActiveSubscription(): boolean {
    const subscription = this.claims.subscription;
    return (
      subscription?.status === SubscriptionStatus.ACTIVE ||
      subscription?.status === SubscriptionStatus.TRIALING
    );
  }

  /**
   * Check if user's subscription status matches any of the required statuses
   */
  private hasValidSubscriptionStatus(
    requiredStatuses: SubscriptionStatus[],
  ): boolean {
    const userSubscriptionStatus = this.claims.subscription
      ?.status as SubscriptionStatus;
    return requiredStatuses.includes(userSubscriptionStatus);
  }

  /**
   * Check if user's subscription type/plan matches any of the required types
   */
  private hasValidSubscriptionType(requiredTypes: string[]): boolean {
    const userPlanName = this.claims.subscription?.plan_name;
    return userPlanName ? requiredTypes.includes(userPlanName) : false;
  }

  /**
   * Check if user has a complete profile
   */
  hasCompleteProfile(): boolean {
    const profile = this.claims.profile;
    if (!profile) return false;

    // Check required fields: firstName, lastName, registrationNumber, phone
    return !!(
      profile.first_name?.trim() &&
      profile.last_name?.trim() &&
      profile.registration_number?.trim() &&
      profile.phone?.trim()
    );
  }

  /**
   * Get missing profile fields
   */
  getMissingProfileFields(): string[] {
    const profile = this.claims.profile;
    const missingFields: string[] = [];

    if (!profile?.first_name?.trim()) missingFields.push("First Name");
    if (!profile?.last_name?.trim()) missingFields.push("Last Name");
    if (!profile?.registration_number?.trim())
      missingFields.push("Registration Number");
    if (!profile?.phone?.trim()) missingFields.push("Phone");

    return missingFields;
  }

  /**
   * Find the matching authorization rule for a given URL
   */
  private findMatchingRule(url: string): AuthorizationRule | null {
    // First, try exact match
    if (this.routeConfig[url]) {
      return this.routeConfig[url];
    }

    // Then try pattern matching (wildcards)
    for (const pattern in this.routeConfig) {
      if (this.matchesPattern(url, pattern)) {
        return this.routeConfig[pattern];
      }
    }

    return null;
  }

  /**
   * Check if a URL matches a pattern (supports wildcards)
   */
  private matchesPattern(url: string, pattern: string): boolean {
    // Convert pattern to regex
    // Replace * with .* for wildcard matching
    const regexPattern = pattern.replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(url);
  }

  /**
   * Get user information for debugging/logging
   */
  getUserInfo() {
    return {
      userId: this.claims.sub,
      roles: this.claims.profile?.roles || [],
      subscriptionStatus: this.claims.subscription?.status,
      planName: this.claims.subscription?.plan_name,
      firstName: this.claims.profile?.first_name,
      lastName: this.claims.profile?.last_name,
    };
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole): boolean {
    const userRoles = this.claims.profile?.roles || [];
    return userRoles.includes(role);
  }

  /**
   * Check if user is an admin
   */
  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  /**
   * Check if user is an optometrist
   */
  isOptometrist(): boolean {
    return this.hasRole(UserRole.OPTOMETRIST);
  }

  /**
   * Check if user has therapeutic endorsement
   */
  hasTherapeuticEndorsement(): boolean {
    return this.claims.profile?.is_therapeutically_endorsed === true;
  }

  /**
   * Create authorization rules dynamically
   */
  static createRule(
    roles: UserRole[],
    options: {
      subscriptionTypes?: string[];
      subscriptionStatuses?: SubscriptionStatus[];
      requiresActiveSubscription?: boolean;
    } = {},
  ): AuthorizationRule {
    return {
      roles,
      subscriptionTypes: options.subscriptionTypes,
      subscriptionStatuses: options.subscriptionStatuses,
      requiresActiveSubscription: options.requiresActiveSubscription,
    };
  }

  /**
   * Get the highest privilege role from user's roles
   * Priority: ADMIN > OPTOMETRIST
   */
  private getHighestPrivilegeRole(): UserRole | null {
    const userRoles = this.claims.profile?.roles || [];

    // Check for roles in order of precedence
    if (userRoles.includes(UserRole.ADMIN)) {
      return UserRole.ADMIN;
    }
    if (userRoles.includes(UserRole.OPTOMETRIST)) {
      return UserRole.OPTOMETRIST;
    }

    return userRoles[0] || null;
  }

  /**
   * Get appropriate redirect URL based on user role
   */
  private getRedirectUrlForRole(
    userRole: UserRole | null,
    errorMessage: string,
  ): string {
    // If no role provided, use highest privilege role
    const roleToUse = userRole || this.getHighestPrivilegeRole();

    switch (roleToUse) {
      case UserRole.ADMIN:
        return "/admin";
      case UserRole.OPTOMETRIST:
        return "/opt";
      default:
        return "/error?error=" + errorMessage;
    }
  }
}
