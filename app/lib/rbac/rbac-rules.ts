import { UserRole, SubscriptionStatus } from "@/lib/db/schema";
import { RouteAuthConfig } from "./rbac";

export const defaultRouteAuthConfig: RouteAuthConfig = {
  // Public routes - no authentication required
  "/": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },
  "/auth": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },
  "/auth/*": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },
  "/error": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },
  "/pricing": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },

  // Admin routes - only admin role
  "/api/admin/*": {
    roles: [UserRole.ADMIN],
    requiresActiveSubscription: false,
  },
  // Optometrist dashboard - optometrist role with active subscription
  "/opt": {
    roles: [UserRole.OPTOMETRIST],
    // subscriptionStatuses: [
    //   SubscriptionStatus.ACTIVE,
    //   SubscriptionStatus.TRIALING,
    // ],
    requiresActiveSubscription: false,
  },

  "/admin": {
    roles: [UserRole.ADMIN],
    // subscriptionStatuses: [
    //   SubscriptionStatus.ACTIVE,
    //   SubscriptionStatus.TRIALING,
    // ],
    requiresActiveSubscription: false,
  },

  // Optometrist dashboard - optometrist role with active subscription
  "/opt/*": {
    roles: [UserRole.OPTOMETRIST],
    // subscriptionStatuses: [
    //   SubscriptionStatus.ACTIVE,
    //   SubscriptionStatus.TRIALING,
    // ],
    requiresActiveSubscription: false,
  },

  // Optometrist dashboard - optometrist role with active subscription
  "/activity/*": {
    roles: [UserRole.OPTOMETRIST],
    // subscriptionStatuses: [
    //   SubscriptionStatus.ACTIVE,
    //   SubscriptionStatus.TRIALING,
    // ],
    requiresActiveSubscription: false,
  },

  "/goal/*": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },

  // Profile routes - any authenticated user
  "/account/*": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },

  "/api/account/*": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },

  "/api/profile": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },

  "/api/activity/*": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },

  "/api/goal": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },

  "/api/report/*": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },

  "/api/goal/*": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },

  "/api/subscriptions/*": {
    roles: [UserRole.OPTOMETRIST],
    requiresActiveSubscription: false,
  },

  "/api/subscription": {
    roles: [UserRole.OPTOMETRIST],
    requiresActiveSubscription: false,
  },

  // Premium features - optometrist with specific plans
  "/opt/premium/*": {
    roles: [UserRole.OPTOMETRIST],
    subscriptionTypes: ["premium", "professional"],
    subscriptionStatuses: [SubscriptionStatus.ACTIVE],
    requiresActiveSubscription: true,
  },
};
