ALTER TABLE "activity_record" ADD COLUMN "tags" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "activity_record" ADD COLUMN "activity_provider" text;--> statement-breakpoint
ALTER TABLE "activity_record" ADD COLUMN "is_draft" boolean DEFAULT true NOT NULL;