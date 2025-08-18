# Profile Context

A React context that manages user authentication and profile state throughout the application.

## Features

- **Automatic Authentication State Management**: Automatically tracks user login/logout status using Supabase Auth
- **Profile Data Synchronization**: Loads and syncs user profile data when authenticated
- **Centralized State**: Single source of truth for user and profile data across the app
- **Error Handling**: Built-in error states for authentication and profile operations
- **Loading States**: Loading indicators for async operations

## Setup

The ProfileProvider is already integrated into the app layout (`app/layout.tsx`):

```tsx
<ClientThemeProvider>
  <ProfileProvider>
    <Nav />
    <Box mx={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>{children}</Box>
    <FooterNav />
  </ProfileProvider>
</ClientThemeProvider>
```

## Basic Usage

### Using the Context Hook

```tsx
import { useProfile } from "@/lib/context/profile-context";

function MyComponent() {
  const { user, profile, isLoading, error, signOut } = useProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.firstName || "User"}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Using the Enhanced Hook

For operations like updating profile, use the enhanced `useProfile` hook from `@/lib/hooks/use-profile`:

```tsx
import { useProfile } from "@/lib/hooks/use-profile";

function ProfileEditor() {
  const { user, profile, isLoading, error, updateProfile, refreshProfile } =
    useProfile();

  const handleUpdate = async () => {
    try {
      await updateProfile({
        firstName: "John",
        lastName: "Doe",
      });
      // Profile is automatically refreshed after update
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  // ... rest of component
}
```

## Authentication Requirements

### Higher-Order Component (HOC)

For pages that require authentication:

```tsx
import { withAuth } from "@/lib/context/profile-context";

function ProtectedPage() {
  return <div>This page requires authentication</div>;
}

export default withAuth(ProtectedPage);
```

### Hook for Profile Requirements

For components that need specific profile states:

```tsx
import { useRequireProfile } from "@/lib/context/profile-context";

function MyComponent() {
  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    hasProfile,
    needsProfileCompletion,
  } = useRequireProfile();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  if (needsProfileCompletion) {
    return <div>Please complete your profile</div>;
  }

  return <div>Welcome {profile.firstName}!</div>;
}
```

## Context API Reference

### ProfileContextType

```typescript
interface ProfileContextType {
  user: User | null; // Supabase user object
  profile: ProfileData | null; // User profile data
  isLoading: boolean; // Loading state
  error: string | null; // Error message
  refreshProfile: () => Promise<void>; // Manually refresh profile
  signOut: () => Promise<void>; // Sign out user
}
```

### Authentication Events

The context automatically handles these Supabase auth events:

- `SIGNED_IN`: Sets user and loads profile
- `SIGNED_OUT`: Clears user and profile
- `TOKEN_REFRESHED`: Updates user token

## Integration with Existing Code

The enhanced `useProfile` hook (`@/lib/hooks/use-profile`) provides backward compatibility while using the context internally. It includes additional methods:

- `fetchProfile()`: Alias for `refreshProfile()`
- `updateProfile(data)`: Update profile data
- `createInitialProfile()`: Create initial profile
- `deleteProfile()`: Delete profile

## Error Handling

The context provides built-in error handling for:

- Authentication failures
- Network errors when fetching profile
- Profile API errors

Errors are exposed via the `error` property and logged to the console.

## Best Practices

1. **Use the context hook directly** for simple read operations
2. **Use the enhanced hook** for profile mutations
3. **Check authentication state** before making authenticated requests
4. **Handle loading and error states** in your components
5. **Use the HOC or requirement hooks** for protected pages/components

## Migration from Old Hook

If you were using the old `useProfile` hook that managed its own state, the new version is backward compatible but now uses the centralized context. No changes to existing components should be needed.
