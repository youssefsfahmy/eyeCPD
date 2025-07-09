# Database Setup with Drizzle ORM

This project uses Drizzle ORM with PostgreSQL for database management. The database schema focuses on user management, profiles, subscriptions, and Stripe integration.

## Schema Overview

### Users Table

- User authentication and basic information
- Supports optometrist and admin roles
- Email verification support

### Profiles Table

- Detailed user profile information
- Links to users table via foreign key
- Stores professional information like registration numbers

### Subscriptions Table

- Manages user subscriptions
- Integrates with Stripe for payment processing
- Tracks subscription status and billing periods

## Setup Instructions

1. **Install Dependencies**

   ```bash
   yarn install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in the required values:

   ```bash
   cp .env.example .env.local
   ```

3. **Database Setup**

   ```bash
   # Generate migration files
   yarn db:generate

   # Run migrations
   yarn db:migrate

   # Seed the database (optional)
   yarn db:seed
   ```

4. **Development Tools**

   ```bash
   # Open Drizzle Studio (database GUI)
   yarn db:studio

   # Push schema changes directly (dev only)
   yarn db:push
   ```

## Available Scripts

- `yarn db:generate` - Generate migration files from schema changes
- `yarn db:migrate` - Apply pending migrations to the database
- `yarn db:push` - Push schema changes directly (for development)
- `yarn db:studio` - Open Drizzle Studio for database exploration
- `yarn db:seed` - Seed the database with initial data

## File Structure

```
lib/db/
├── schema.ts          # Database schema definitions
├── queries.ts         # Database query functions
├── drizzle.ts         # Database connection setup
├── seed.ts            # Database seeding script
└── migrations/        # Auto-generated migration files

lib/payments/
└── stripe.ts          # Stripe client configuration
```

## Key Features

- **Type Safety**: Full TypeScript support with Drizzle ORM
- **Migration Management**: Automatic migration generation and application
- **Stripe Integration**: Built-in support for subscription management
- **User Profiles**: Comprehensive user and profile management
- **Development Tools**: Drizzle Studio for database exploration

## Next Steps

1. Set up your PostgreSQL database
2. Configure environment variables
3. Run migrations to create tables
4. Implement authentication session management
5. Set up Stripe webhooks for subscription updates
