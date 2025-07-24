CREATE TABLE "activity_record" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"clinical" boolean DEFAULT false NOT NULL,
	"non_clinical" boolean DEFAULT false NOT NULL,
	"interactive" boolean DEFAULT false NOT NULL,
	"therapeutic" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"date" date NOT NULL,
	"hours" numeric(4, 2) NOT NULL,
	"description" text NOT NULL,
	"reflection" text NOT NULL,
	"evidence_file_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint
ALTER TABLE
	"activity_record"
ADD
	CONSTRAINT "activity_record_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint