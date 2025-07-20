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

export class RoleBasedAccessControl {
  private claims: SupabaseClaimsResult;
  private routeConfig: RouteAuthConfig;

  constructor(
    claims: SupabaseClaimsResult,
    routeConfig: RouteAuthConfig = defaultRouteAuthConfig
  ) {
    this.claims = claims;
    this.routeConfig = routeConfig;
  }

  /**
   * Check if the user is authorized to access a specific URL
   * @param url - The URL to check authorization for
   * @param customRules - Optional custom authorization rules to override defaults
   * @returns boolean indicating if access is authorized
   */
  isAuthorized(url: string, customRules?: AuthorizationRule): boolean {
    const rules = customRules || this.findMatchingRule(url);

    if (!rules) {
      console.log("No authorization rules found for URL:", url);
      // If no rules are found, deny access by default
      return false;
    }

    // Check role authorization
    if (!this.hasRequiredRole(rules.roles)) {
      console.log(
        "Access denied for user:",
        this.getUserInfo(),
        "to URL:",
        url
      );
      return false;
    }

    // Check subscription requirements
    if (rules.requiresActiveSubscription && !this.hasActiveSubscription()) {
      console.log(
        "Access denied for user:",
        this.getUserInfo(),
        "due to missing active subscription"
      );
      return false;
    }

    // Check subscription status requirements
    if (
      rules.subscriptionStatuses &&
      !this.hasValidSubscriptionStatus(rules.subscriptionStatuses)
    ) {
      console.log(
        "Access denied for user:",
        this.getUserInfo(),
        "due to invalid subscription status"
      );
      return false;
    }

    // Check subscription type/plan requirements
    if (
      rules.subscriptionTypes &&
      !this.hasValidSubscriptionType(rules.subscriptionTypes)
    ) {
      console.log(
        "Access denied for user:",
        this.getUserInfo(),
        "due to invalid subscription type"
      );
      return false;
    }

    return true;
  }

  /**
   * Check if user has any of the required roles
   */
  private hasRequiredRole(requiredRoles: UserRole[]): boolean {
    const userRole = this.claims.profile?.role as UserRole;
    return requiredRoles.includes(userRole);
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
    requiredStatuses: SubscriptionStatus[]
  ): boolean {
    const userSubscriptionStatus = this.claims.subscription
      ?.status as SubscriptionStatus;
    return requiredStatuses.includes(userSubscriptionStatus);
  }

  /**
   * Check if user's subscription type/plan matches any of the required types
   */
  private hasValidSubscriptionType(requiredTypes: string[]): boolean {
    const userPlanName = this.claims.subscription?.planName;
    return userPlanName ? requiredTypes.includes(userPlanName) : false;
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
      console.log("Checking pattern:", pattern, "for URL:", url);
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
      role: this.claims.profile?.role,
      subscriptionStatus: this.claims.subscription?.status,
      planName: this.claims.subscription?.planName,
      firstName: this.claims.profile?.firstName,
      lastName: this.claims.profile?.lastName,
    };
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole): boolean {
    return this.claims.profile?.role === role;
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
    return this.claims.profile?.isTherapeuticallyEndorsed === true;
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
    } = {}
  ): AuthorizationRule {
    return {
      roles,
      subscriptionTypes: options.subscriptionTypes,
      subscriptionStatuses: options.subscriptionStatuses,
      requiresActiveSubscription: options.requiresActiveSubscription,
    };
  }
}

// Utility functions for common authorization checks
export const AuthUtils = {
  /**
   * Create RBAC instance from claims
   */
  fromClaims: (
    claims: SupabaseClaimsResult,
    customConfig?: RouteAuthConfig
  ) => {
    return new RoleBasedAccessControl(claims, customConfig);
  },

  /**
   * Quick authorization check
   */
  isAuthorized: (
    claims: SupabaseClaimsResult,
    url: string,
    customRules?: AuthorizationRule
  ) => {
    const rbac = new RoleBasedAccessControl(claims);
    return rbac.isAuthorized(url, customRules);
  },

  /**
   * Check if claims are valid and complete
   */
  validateClaims: (claims: SupabaseClaimsResult): boolean => {
    return !!claims?.profile?.role;
  },
};
