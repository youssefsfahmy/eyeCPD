CREATE TABLE "goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"year" text NOT NULL,
	"title" text NOT NULL,
	"tags" text[] DEFAULT '{}',
	"clinical" boolean DEFAULT false NOT NULL,
	"non_clinical" boolean DEFAULT false NOT NULL,
	"interactive" boolean DEFAULT false NOT NULL,
	"therapeutic" boolean DEFAULT false NOT NULL,
	"target_hours" numeric(4, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;