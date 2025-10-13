CREATE TABLE "activity_tag" (
	"tag_id" serial NOT NULL,
	"activity_record_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"tag" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "goals" ALTER COLUMN "description" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "activity_tag" ADD CONSTRAINT "activity_tag_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_tag" ADD CONSTRAINT "activity_tag_activity_record_id_activity_record_id_fk" FOREIGN KEY ("activity_record_id") REFERENCES "public"."activity_record"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;