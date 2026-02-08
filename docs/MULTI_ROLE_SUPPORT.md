# Multi-Role User Support

## Overview

Users can now have multiple roles assigned to them simultaneously. This enables flexible access control where a user can be both an OPTOMETRIST and an ADMIN, for example.

## Implementation Details

### Database Schema

- **Column**: `profiles.roles` (TEXT[])
- **Type**: Array of text values
- **Default**: `['optometrist']`
- **Constraint**: Array cannot be empty
- **Index**: GIN index on `roles` column for efficient queries

### Role Precedence

When a user has multiple roles, the system uses the following priority order for redirects and default behavior:

1. **ADMIN** (highest privilege)
2. **OPTOMETRIST**

### Authorization

- **Role Checks**: Use `hasRole(role)` to check if a user has a specific role
- **Route Access**: Users can access any route that matches ANY of their roles
- **Middleware**: Automatically redirects to highest-privilege role's default page

### Role Management

- **Who Can Edit**: Only administrators can modify user roles
- **UI Display**: Roles are shown as a comma-separated list in the profile page
- **API Updates**: Use the profile API with `roles` array field

## Migration

### Database Migration

Run the migration script to convert existing single-role data:

```bash
# Apply the migration
psql -d your_database -f supabase/migrations/add_multi_role_support.sql
```

### Updating Supabase Claims

Update your Supabase database function that populates JWT claims to return roles as an array:

```sql
-- Example: Update claims function
CREATE OR REPLACE FUNCTION get_user_claims(user_id UUID)
RETURNS JSON AS $$
DECLARE
  user_profile RECORD;
BEGIN
  SELECT * INTO user_profile FROM profiles WHERE user_id = user_id;

  RETURN json_build_object(
    'profile', json_build_object(
      'roles', user_profile.roles,  -- Now returns array
      -- ... other fields
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## API Examples

### Check if User Has Role

```typescript
import { RoleBasedAccessControl } from "@/app/lib/rbac/rbac";

const rbac = new RoleBasedAccessControl(claims);
const isAdmin = rbac.hasRole(UserRole.ADMIN);
const isOptometrist = rbac.hasRole(UserRole.OPTOMETRIST);
```

### Update User Roles (Admin Only)

```typescript
// PUT /api/profile
await fetch("/api/profile", {
  method: "PUT",
  body: JSON.stringify({
    roles: ["admin", "optometrist"],
  }),
});
```

### Query Profiles by Role

```typescript
import { ProfileQueries } from "@/lib/db/queries/profile";

// Get all users with admin role
const admins = await ProfileQueries.getProfilesByRole("admin");
```

## Component Usage

### Display User Roles

```tsx
// Profile is automatically fetched with roles array
<TextField label="Roles" value={profile?.roles?.join(", ")} disabled />
```

### Check Role in Component

```tsx
import { useProfile } from "@/lib/context/profile-context";

function AdminPanel() {
  const { profile } = useProfile();
  const isAdmin = profile?.roles?.includes("admin");

  if (!isAdmin) return <AccessDenied />;
  return <AdminContent />;
}
```

## Testing

### Test Multi-Role User

1. Create a test user via sign-up
2. As admin, update their profile:
   ```sql
   UPDATE profiles
   SET roles = ARRAY['admin', 'optometrist']
   WHERE user_id = 'test-user-id';
   ```
3. Log in as that user and verify:
   - User can access both `/admin` and `/opt` routes
   - Redirects go to `/admin` (highest privilege)
   - Profile page shows both roles

## Breaking Changes

### Code Updates Required

- Any direct access to `profile.role` must be changed to `profile.roles`
- Role comparisons must use `.includes()` instead of `===`
- Default role values should be arrays: `['optometrist']` not `'optometrist'`

### Migration Checklist

- ✅ Database schema updated
- ✅ TypeScript types updated
- ✅ RBAC utilities updated
- ✅ Middleware updated
- ✅ API endpoints updated
- ✅ UI components updated
- ✅ Claims structure updated
- ⚠️ Supabase claims function (manual update required)
- ⚠️ Database migration (manual execution required)

## Future Enhancements

- Role-based UI permission system
- Role hierarchy configuration
- User-selectable primary role
- Role expiration/time-based roles
- Audit log for role changes
