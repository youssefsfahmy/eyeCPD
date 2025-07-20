# RBAC Profile Completeness Feature

## Overview

The RBAC system now includes automatic profile completeness checking. Users with incomplete profiles are automatically redirected to complete their profile information before accessing protected resources.

## Required Profile Fields

The system checks for these required fields:

- **First Name**: User's first name
- **Last Name**: User's last name
- **Registration Number**: Professional registration number
- **Phone**: Contact phone number

## How It Works

### 1. Automatic Profile Check

When `isAuthorized()` is called, the system:

1. Checks user roles and permissions (existing functionality)
2. **NEW**: Automatically checks if the user's profile is complete
3. If profile is incomplete, returns authorization failure with redirect to profile page

### 2. Route Exclusions

Profile completeness is NOT checked for:

- Profile-related routes (containing `/profile`)
- Authentication routes (containing `/auth`)

This prevents redirect loops and allows users to complete their profiles.

### 3. Authorization Result

The `AuthorizationResult` now includes a new reason:

```typescript
interface AuthorizationResult {
  isAuthorized: boolean;
  redirectUrl?: string;
  message?: string;
  reason?:
    | "no_rules"
    | "invalid_role"
    | "inactive_subscription"
    | "invalid_subscription_status"
    | "invalid_subscription_type"
    | "incomplete_profile"; // <- NEW
}
```

## Usage Examples

### 1. Basic Profile Check

```typescript
const rbac = new RoleBasedAccessControl(claims);

// Check if profile is complete
const isComplete = rbac.hasCompleteProfile();
const missingFields = rbac.getMissingProfileFields();

console.log("Profile complete:", isComplete);
console.log("Missing fields:", missingFields);
// Output: ['First Name', 'Phone']
```

### 2. Authorization with Profile Check

```typescript
const authResult = rbac.isAuthorized("/opt/dashboard");

if (!authResult.isAuthorized) {
  if (authResult.reason === "incomplete_profile") {
    // Handle profile completion
    console.log(authResult.message);
    // "Please complete your profile. Missing fields: First Name, Phone"

    // Redirect to profile page
    router.push(authResult.redirectUrl); // '/opt/account/profile'
  }
}
```

### 3. Utility Functions

```typescript
// Quick checks using AuthUtils
const isComplete = AuthUtils.hasCompleteProfile(claims);
const missingFields = AuthUtils.getMissingProfileFields(claims);

// Authorization check that includes profile completeness
const authResult = AuthUtils.isAuthorized(claims, "/opt/premium-features");
```

### 4. React Components

```typescript
// Profile completion banner
<ProfileCompletionBanner
  claims={claims}
  onComplete={() => router.push('/opt/account/profile')}
/>

// Authorization with profile awareness
<AuthorizedRoute
  claims={claims}
  requiredUrl="/opt/dashboard"
  onUnauthorized={(result) => {
    if (result.reason === 'incomplete_profile') {
      toast.warning(result.message);
      router.push(result.redirectUrl);
    }
  }}
>
  <DashboardContent />
</AuthorizedRoute>

// Hook for profile-aware authorization
const {
  isAuthorized,
  hasCompleteProfile,
  missingFields,
  authResult
} = useAuthorizationWithProfile(claims, '/opt/dashboard');
```

## Middleware Integration

The authorize middleware automatically handles profile completeness:

```typescript
// In authorize.ts middleware
const authResult = rbac.isAuthorized(request.nextUrl.pathname);

if (!authResult.isAuthorized) {
  if (authResult.reason === "incomplete_profile") {
    // Redirect to profile completion page
    return NextResponse.redirect(new URL(authResult.redirectUrl, request.url));
  }

  // Handle other authorization failures...
}
```

## Profile Completion Flow

1. **User logs in** with incomplete profile
2. **Attempts to access** any protected route (e.g., `/opt/dashboard`)
3. **RBAC system detects** incomplete profile
4. **User is redirected** to `/opt/account/profile`
5. **User completes** required fields
6. **User can now access** protected routes

## Error Messages

The system provides specific error messages:

- **Missing single field**: "Please complete your profile. Missing fields: Phone"
- **Missing multiple fields**: "Please complete your profile. Missing fields: First Name, Phone, Registration Number"

## Route Patterns

Profile completeness is enforced for all routes EXCEPT:

- `/auth/*` - Authentication routes
- `/*/profile*` - Any profile-related routes
- `/api/profile*` - Profile API endpoints

## Best Practices

### 1. Handle Profile Completion Gracefully

```typescript
// Good: Show informative message and clear action
if (authResult.reason === "incomplete_profile") {
  return (
    <div className="profile-incomplete">
      <h3>Complete Your Profile</h3>
      <p>{authResult.message}</p>
      <Button href={authResult.redirectUrl}>Complete Now</Button>
    </div>
  );
}
```

### 2. Use Profile Completion Banner

```typescript
// Show banner even on authorized pages
<div className="app-content">
  <ProfileCompletionBanner claims={claims} />
  <AuthorizedRoute claims={claims} requiredUrl={currentUrl}>
    <MainContent />
  </AuthorizedRoute>
</div>
```

### 3. Validate Profile on Save

```typescript
// In profile form submission
const missingFields = AuthUtils.getMissingProfileFields(updatedClaims);
if (missingFields.length > 0) {
  setErrors(`Still missing: ${missingFields.join(", ")}`);
  return;
}

// Profile is now complete, user can access all features
```

## Testing Profile Completeness

```typescript
// Mock incomplete profile for testing
const incompleteProfileClaims: SupabaseClaimsResult = {
  // ...other user data
  profile: {
    role: "optometrist",
    firstName: "John",
    lastName: "", // Missing!
    phone: "", // Missing!
    registrationNumber: "12345",
    // ...other fields
  },
};

const rbac = new RoleBasedAccessControl(incompleteProfileClaims);
const authResult = rbac.isAuthorized("/opt/dashboard");

expect(authResult.isAuthorized).toBe(false);
expect(authResult.reason).toBe("incomplete_profile");
expect(authResult.redirectUrl).toBe("/opt/account/profile");
expect(authResult.message).toContain("Last Name, Phone");
```

This feature ensures that all users have complete profiles before they can fully use the application, improving data quality and user experience.
