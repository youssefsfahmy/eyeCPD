ALTER TABLE "activity_tag" ALTER COLUMN "tag_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "activity_tag" ALTER COLUMN "activity_record_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "activity_tag" ADD CONSTRAINT "activity_tag_activity_record_id_tag_id_pk" PRIMARY KEY("activity_record_id","tag_id");--> statement-breakpoint
ALTER TABLE "activity_record" DROP COLUMN "tags";