import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  uuid,
  boolean,
  decimal,
  date,
  pgSchema,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const authSchema = pgSchema("auth");

const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
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
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
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

export const activityRecords = pgTable("activity_record", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  // Activity type booleans
  clinical: boolean("clinical").notNull().default(false),
  nonClinical: boolean("non_clinical").notNull().default(false),
  interactive: boolean("interactive").notNull().default(false),
  therapeutic: boolean("therapeutic").notNull().default(false),

  // Activity details
  name: text("name").notNull(),
  date: date("date").notNull(),
  hours: decimal("hours", { precision: 4, scale: 2 }).notNull(), // Supports 0.25 intervals
  description: text("description").notNull(),
  reflection: text("reflection").notNull(),

  // Evidence file information
  evidenceFileUrl: text("evidence_file_url"), // URL to stored file

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

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  subscription: one(subscriptions, {
    fields: [profiles.userId],
    references: [subscriptions.userId],
  }),
  activityRecords: many(activityRecords), // New relation
}));

export const activityRecordRelations = relations(
  activityRecords,
  ({ one }) => ({
    profile: one(profiles, {
      fields: [activityRecords.userId],
      references: [profiles.userId],
    }),
  })
);

// ✅ ENUMS
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

// Supported file types for evidence
export enum EvidenceFileType {
  PDF = "pdf",
  JPG = "jpg",
  JPEG = "jpeg",
  PNG = "png",
  DOC = "doc",
  DOCX = "docx",
}

// ✅ TYPES
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type ActivityRecord = typeof activityRecords.$inferSelect;
export type NewActivityRecord = typeof activityRecords.$inferInsert;

export interface EvidenceFile {
  fileName: string;
  fileType: EvidenceFileType;
  fileUrl: string;
  fileSize: number;
}

export interface ActivityRecordFormData {
  activityName: string;
  activityDate: string;
  hours: number;
  description: string;
  reflection: string;
  clinical: boolean;
  nonClinical: boolean;
  interactive: boolean;
  therapeutic: boolean;
  evidenceFile?: EvidenceFile;
}
