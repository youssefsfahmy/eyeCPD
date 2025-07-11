# Stripe Webhook Events Handler

This document outlines all the Stripe webhook events that are handled by the application.

## Overview

The webhook handler in `/app/api/subscriptions/webhook/route.ts` processes various Stripe events to keep the application's subscription and customer data synchronized with Stripe.

## Event Categories

### 1. Subscription Events

#### `customer.subscription.created`

- **Handler**: `handleSubscriptionCreated()`
- **Purpose**: Creates a new subscription record when a customer successfully subscribes
- **Actions**:
  - Retrieves customer information
  - Creates subscription record in database
  - Links subscription to user via customer metadata

#### `customer.subscription.updated`

- **Handler**: `handleSubscriptionChange()`
- **Purpose**: Updates subscription status, billing periods, and other changes
- **Actions**:
  - Updates subscription status
  - Updates billing period dates
  - Updates cancellation information

#### `customer.subscription.deleted`

- **Handler**: `handleSubscriptionChange()`
- **Purpose**: Handles subscription cancellations and deletions
- **Actions**:
  - Updates subscription status to cancelled
  - Sets cancellation timestamps

### 2. Customer Events

#### `customer.created`

- **Handler**: `handleCustomerCreated()`
- **Purpose**: Logs customer creation (typically handled during sign-up)
- **Actions**:
  - Logs customer creation for audit purposes
  - Can be extended for additional customer setup

#### `customer.updated`

- **Handler**: `handleCustomerUpdated()`
- **Purpose**: Handles customer information updates
- **Actions**:
  - Logs customer updates
  - Can sync customer changes to user profiles

#### `customer.deleted`

- **Handler**: `handleCustomerDeleted()`
- **Purpose**: Cleans up data when a customer is deleted
- **Actions**:
  - Finds associated subscription
  - Deletes subscription record from database

### 3. Payment Events

#### `payment_intent.succeeded`

- **Handler**: `handlePaymentSucceeded()`
- **Purpose**: Processes successful payments
- **Actions**:
  - Logs successful payment
  - Can trigger confirmation emails
  - Can update payment history

#### `payment_intent.payment_failed`

- **Handler**: `handlePaymentFailed()`
- **Purpose**: Handles payment failures
- **Actions**:
  - Logs payment failure
  - Can trigger notification emails
  - Can initiate retry logic

### 4. Invoice Events

#### `invoice.payment_succeeded`

- **Handler**: `handleInvoicePaymentSucceeded()`
- **Purpose**: Processes successful invoice payments (renewals)
- **Actions**:
  - Updates associated subscription
  - Confirms subscription renewal

#### `invoice.payment_failed`

- **Handler**: `handleInvoicePaymentFailed()`
- **Purpose**: Handles failed invoice payments
- **Actions**:
  - Updates subscription status
  - Can trigger dunning emails

#### `invoice.created`

- **Purpose**: Logs invoice creation
- **Actions**: Logging only (can be extended)

#### `invoice.finalized`

- **Purpose**: Logs when invoices are finalized
- **Actions**: Logging only (can be extended)

### 5. Checkout Events

#### `checkout.session.completed`

- **Handler**: `handleCheckoutCompleted()`
- **Purpose**: Processes completed checkout sessions
- **Actions**:
  - Creates new subscription if applicable
  - Confirms successful checkout

#### `checkout.session.expired`

- **Purpose**: Logs expired checkout sessions
- **Actions**: Logging only (can be extended)

### 6. Product and Pricing Events

#### `price.created`

- **Purpose**: Logs new price creation
- **Actions**: Logging only (can be extended)

#### `price.updated`

- **Handler**: `handlePriceUpdated()`
- **Purpose**: Handles price changes
- **Actions**:
  - Logs price updates
  - Can update cached pricing information

#### `product.created`

- **Purpose**: Logs new product creation
- **Actions**: Logging only (can be extended)

#### `product.updated`

- **Handler**: `handleProductUpdated()`
- **Purpose**: Handles product changes
- **Actions**:
  - Logs product updates
  - Can update cached product information

### 7. Payment Method Events

#### `setup_intent.succeeded`

- **Purpose**: Logs successful payment method setup
- **Actions**: Logging only (can be extended)

#### `setup_intent.setup_failed`

- **Purpose**: Logs failed payment method setup
- **Actions**: Logging only (can be extended)

#### `payment_method.attached`

- **Purpose**: Logs when payment methods are attached to customers
- **Actions**: Logging only (can be extended)

#### `payment_method.detached`

- **Purpose**: Logs when payment methods are removed
- **Actions**: Logging only (can be extended)

### 8. Other Events

#### Coupon Events

- `coupon.created`, `coupon.updated`, `coupon.deleted`
- **Actions**: Logging only (can be extended for promotions)

#### Charge Events

- `charge.succeeded`, `charge.failed`
- **Actions**: Logging only (can be extended for payment tracking)

#### Dispute Events

- `charge.dispute.created`
- **Actions**: Logging only (can be extended for dispute handling)

## Error Handling

- All webhook events are wrapped in try-catch blocks
- Failed events return a 500 status code
- Successful events return a 200 status code with `{ received: true }`
- All events are logged with appropriate details

## Configuration

### Required Environment Variables

- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your webhook endpoint secret

### Webhook Endpoint

- URL: `/api/subscriptions/webhook`
- Method: `POST`
- Content-Type: `application/json`

## Database Operations

The webhook handlers interact with the database through:

- `SubscriptionQueries.createSubscription()`
- `SubscriptionQueries.updateSubscriptionByStripeId()`
- `SubscriptionQueries.getSubscriptionByStripeSubscriptionId()`
- `SubscriptionQueries.getSubscriptionByStripeCustomerId()`
- `SubscriptionQueries.deleteSubscription()`

## Security

- Webhook signature verification using Stripe's webhook secret
- All events are verified before processing
- Failed signature verification returns 400 status

## Extensibility

Each handler function can be extended to:

- Send notification emails
- Update user profiles
- Trigger business logic
- Integrate with other services
- Update analytics

## Testing

To test webhook events:

1. Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/subscriptions/webhook`
2. Trigger events in Stripe Dashboard
3. Use Stripe's webhook testing tools
4. Check application logs for event processing

## Monitoring

Consider implementing:

- Event processing metrics
- Failed event alerts
- Webhook delivery monitoring
- Database operation logging
