import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().unique(), // References Supabase auth.users.id
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  registrationNumber: varchar("registration_number", { length: 50 }),
  role: varchar("role", { length: 20 }).notNull().default("optometrist"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isTherapeuticallyEndorsed: boolean("is_therapeutically_endorsed")
    .notNull()
    .default(false),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().unique(), // References Supabase auth.users.id - unique for one-to-one
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

// ✅ RELATIONS
// Note: We don't define relations to Supabase auth.users table since it's managed by Supabase

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  profile: one(profiles, {
    fields: [subscriptions.userId],
    references: [profiles.userId],
  }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [profiles.userId],
    references: [subscriptions.userId],
  }),
}));

// ✅ Types

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

// Subscription status enum for better type safety
export enum SubscriptionStatus {
  ACTIVE = "active",
  CANCELED = "canceled",
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",
  PAST_DUE = "past_due",
  TRIALING = "trialing",
  UNPAID = "unpaid",
}

// User role enum
export enum UserRole {
  OPTOMETRIST = "optometrist",
  ADMIN = "admin",
}
