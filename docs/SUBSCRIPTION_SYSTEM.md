# Subscription System Documentation

## Overview

This subscription system provides complete functionality for managing user subscriptions using Stripe as the payment processor. It includes:

- **Database Schema**: Subscription tables with Drizzle ORM
- **API Endpoints**: RESTful APIs for subscription management
- **React Hook**: `useSubscription` for frontend integration
- **Service Layer**: Business logic for subscription operations
- **Admin Interface**: Administrative controls for subscription management

## Files Created/Modified

### 1. Database Layer

- `/lib/queries/subscription.ts` - Database queries for subscription management
- `/lib/db/schema.ts` - Updated with subscription schema (already existed)

### 2. Service Layer

- `/services/subscription.ts` - Business logic for subscriptions
- `/lib/payments/stripe.ts` - Updated Stripe integration

### 3. Hooks & Types

- `/lib/hooks/use-subscription.ts` - React hook for subscription management
- `/lib/types/subscription.ts` - TypeScript types and exports

### 4. API Endpoints

- `/app/api/subscription/route.ts` - Main subscription API (GET, PUT, DELETE)
- `/app/api/subscriptions/billing-history/route.ts` - Billing history endpoint
- `/app/api/subscriptions/checkout/route.ts` - Updated checkout handling
- `/app/api/subscriptions/plans/route.ts` - Already existed
- `/app/api/subscriptions/portal/route.ts` - Updated portal access
- `/app/api/subscriptions/webhook/route.ts` - Updated webhook handling
- `/app/api/admin/subscriptions/route.ts` - Updated admin endpoint

### 5. Frontend Components

- `/app/account/components/subscription/index.tsx` - Updated subscription management UI
- `/app/pricing/page.tsx` - Pricing page with plan selection

## API Endpoints

### Subscription Management

#### `GET /api/subscription`

Get current user's subscription details.

**Response:**

```json
{
  "subscription": {
    "id": 1,
    "userId": "user-uuid",
    "stripeCustomerId": "cus_xxx",
    "stripeSubscriptionId": "sub_xxx",
    "status": "active",
    "planName": "Professional Plan",
    "currentPeriodStart": "2024-01-01T00:00:00Z",
    "currentPeriodEnd": "2024-02-01T00:00:00Z"
  }
}
```

#### `PUT /api/subscription`

Update user's subscription (change plan).

**Body:**

```json
{
  "priceId": "price_xxx"
}
```

#### `DELETE /api/subscription`

Cancel user's subscription (cancel at period end).

### Billing & Plans

#### `GET /api/subscriptions/plans`

Get available subscription plans.

#### `GET /api/subscriptions/billing-history`

Get user's billing history.

#### `POST /api/subscriptions/checkout`

Create Stripe checkout session.

**Body:**

```json
{
  "priceId": "price_xxx",
  "successUrl": "optional-success-url",
  "cancelUrl": "optional-cancel-url"
}
```

#### `POST /api/subscriptions/portal`

Create Stripe customer portal session.

**Body:**

```json
{
  "returnUrl": "optional-return-url"
}
```

## Using the useSubscription Hook

```tsx
import { useSubscription } from "@/lib/hooks/use-subscription";

function SubscriptionComponent() {
  const {
    subscription,
    plans,
    billingHistory,
    isLoading,
    error,
    fetchSubscription,
    fetchPlans,
    fetchBillingHistory,
    createCheckoutSession,
    cancelSubscription,
    updateSubscription,
    createPortalSession,
  } = useSubscription();

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleSubscribe = async (priceId: string) => {
    try {
      const checkoutUrl = await createCheckoutSession(priceId);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  // Component JSX...
}
```

## Using the Subscription Service

```typescript
import { SubscriptionService } from "@/services/subscription";

const subscriptionService = new SubscriptionService();

// Get current user's subscription
const result = await subscriptionService.getSubscriptionForCurrentUser();

// Check if user has active subscription
const hasActive = await subscriptionService.hasActiveSubscription(userId);

// Create checkout session
const checkoutUrl = await subscriptionService.createCheckoutSession(
  userId,
  priceId,
  userEmail
);
```

## Database Schema

The subscription system uses the following database schema:

```typescript
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePriceId: text("stripe_price_id"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  planName: varchar("plan_name", { length: 50 }),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: timestamp("cancel_at_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

## Environment Variables

Make sure you have these environment variables set:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Webhook Setup

The webhook endpoint `/api/subscriptions/webhook` handles these Stripe events:

- `customer.subscription.updated`
- `customer.subscription.deleted`

Set up your Stripe webhook to point to: `https://yourdomain.com/api/subscriptions/webhook`

## Admin Features

Admin users can access additional subscription management features:

- View all subscriptions
- Sync subscription data with Stripe
- Monitor subscription metrics

Access the admin endpoint at `/api/admin/subscriptions` (requires admin role).

## Security

- All endpoints require authentication
- Admin endpoints require admin role verification
- Stripe webhooks are verified using webhook signatures
- User data is properly scoped to prevent unauthorized access

## Error Handling

The system includes comprehensive error handling:

- Database connection errors
- Stripe API errors
- Authentication failures
- Validation errors

All errors are logged and appropriate error responses are returned to the client.
