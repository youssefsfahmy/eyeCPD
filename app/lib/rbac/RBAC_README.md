# Role-Based Access Control (RBAC) System

This RBAC system provides fine-grained authorization control based on user roles, subscription types, and subscription statuses.

## Overview

The system takes `SupabaseClaimsResult` as input and provides authorization based on:

- User roles (admin, optometrist)
- Subscription types/plans (free, premium, professional, etc.)
- Subscription statuses (active, trialing, canceled, etc.)
- URL patterns and routes

## Basic Usage

### 1. Simple Authorization Check

```typescript
import { RoleBasedAccessControl, AuthUtils } from "./rbac";
import { UserRole, SubscriptionStatus } from "@/lib/db/schema";

// Quick check using utility function
const isAuthorized = AuthUtils.isAuthorized(claims, "/opt/dashboard");

// Or create an RBAC instance for multiple checks
const rbac = AuthUtils.fromClaims(claims);
const canAccessDashboard = rbac.isAuthorized("/opt/dashboard");
const canAccessAdmin = rbac.isAuthorized("/api/admin/users");
```

### 2. Custom Authorization Rules

```typescript
// Create custom rules for specific scenarios
const customRule = RoleBasedAccessControl.createRule([UserRole.OPTOMETRIST], {
  subscriptionTypes: ["premium", "professional"],
  subscriptionStatuses: [SubscriptionStatus.ACTIVE],
  requiresActiveSubscription: true,
});

const isAuthorized = rbac.isAuthorized("/special-feature", customRule);
```

### 3. Role and Subscription Checks

```typescript
const rbac = new RoleBasedAccessControl(claims);

// Role checks
if (rbac.isAdmin()) {
  // Admin-only functionality
}

if (rbac.isOptometrist() && rbac.hasTherapeuticEndorsement()) {
  // Optometrist with therapeutic endorsement
}

// Subscription checks
if (rbac.hasActiveSubscription()) {
  // User has active subscription
}
```

## Default Route Configuration

The system comes with predefined route patterns:

| Route Pattern       | Roles                  | Subscription Requirements     |
| ------------------- | ---------------------- | ----------------------------- |
| `/api/admin/*`      | Admin only             | None                          |
| `/opt/*`            | Optometrist            | Active or Trialing            |
| `/api/profile`      | Any authenticated user | None                          |
| `/api/subscription` | Optometrist            | None                          |
| `/account/*`        | Optometrist            | None                          |
| `/opt/premium/*`    | Optometrist            | Premium/Professional + Active |

## Custom Route Configuration

You can define your own route authorization rules:

```typescript
import { RouteAuthConfig } from "./rbac";

const customRouteConfig: RouteAuthConfig = {
  "/api/reports/*": {
    roles: [UserRole.OPTOMETRIST],
    subscriptionTypes: ["professional"],
    subscriptionStatuses: [SubscriptionStatus.ACTIVE],
    requiresActiveSubscription: true,
  },
  "/api/bulk-operations/*": {
    roles: [UserRole.ADMIN],
    requiresActiveSubscription: false,
  },
  "/public/*": {
    roles: [UserRole.OPTOMETRIST, UserRole.ADMIN],
    requiresActiveSubscription: false,
  },
};

const rbac = new RoleBasedAccessControl(claims, customRouteConfig);
```

## Middleware Integration

The authorization middleware automatically applies RBAC to all requests:

```typescript
// In authorize.ts middleware
const rbac = new RoleBasedAccessControl(claims);
const isAuthorized = rbac.isAuthorized(request.nextUrl.pathname);

if (!isAuthorized) {
  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}
```

## Advanced Usage

### 1. Dynamic Rule Creation

```typescript
// Create rules based on runtime conditions
const createDynamicRule = (userHasSpecialAccess: boolean) => {
  const baseRoles = [UserRole.OPTOMETRIST];
  const subscriptionTypes = userHasSpecialAccess
    ? ["basic", "premium", "professional"]
    : ["premium", "professional"];

  return RoleBasedAccessControl.createRule(baseRoles, {
    subscriptionTypes,
    requiresActiveSubscription: true,
  });
};
```

### 2. Debugging and Logging

```typescript
const rbac = new RoleBasedAccessControl(claims);
const userInfo = rbac.getUserInfo();

console.log("User attempting access:", userInfo);
console.log("Has admin role:", rbac.isAdmin());
console.log("Has active subscription:", rbac.hasActiveSubscription());
```

### 3. Claims Validation

```typescript
// Validate claims before creating RBAC instance
if (!AuthUtils.validateClaims(claims)) {
  throw new Error("Invalid or incomplete user claims");
}

const rbac = AuthUtils.fromClaims(claims);
```

## Error Handling

The system provides detailed error information:

```typescript
try {
  const rbac = new RoleBasedAccessControl(claims);

  if (!rbac.isAuthorized("/protected-route")) {
    // Handle unauthorized access
    console.log("Access denied for user:", rbac.getUserInfo());
  }
} catch (error) {
  console.error("RBAC error:", error);
}
```

## Testing

Example test cases for the RBAC system:

```typescript
// Mock claims for testing
const mockOptometristClaims: SupabaseClaimsResult = {
  id: "user-123",
  profile: {
    role: "optometrist",
    userId: "user-123",
    firstName: "John",
    lastName: "Doe",
    isTherapeuticallyEndorsed: true,
    // ... other profile fields
  },
  subscription: {
    status: "active",
    planName: "premium",
    userId: "user-123",
    // ... other subscription fields
  },
  // ... other user fields
};

const rbac = new RoleBasedAccessControl(mockOptometristClaims);

// Test cases
expect(rbac.isAuthorized("/opt/dashboard")).toBe(true);
expect(rbac.isAuthorized("/api/admin/users")).toBe(false);
expect(rbac.hasTherapeuticEndorsement()).toBe(true);
```

## Security Considerations

1. **Default Deny**: The system denies access by default if no matching rules are found
2. **Claims Validation**: Always validate claims structure before using RBAC
3. **Role Hierarchy**: Admin users don't automatically inherit optometrist permissions
4. **Subscription Validation**: Check both status and plan type for subscription-based features
5. **URL Pattern Matching**: Use precise patterns to avoid unintended access grants

## Migration Guide

If you're migrating from a simpler authorization system:

1. Replace direct role checks with RBAC instance methods
2. Update route protection logic to use `isAuthorized()`
3. Define your route configuration based on existing access patterns
4. Add subscription-based authorization where needed
5. Test thoroughly with different user types and subscription states
