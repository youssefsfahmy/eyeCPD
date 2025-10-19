CREATE TABLE "goal_tag" (
	"tag_id" integer NOT NULL,
	"goal_id" integer NOT NULL,
	CONSTRAINT "goal_tag_goal_id_tag_id_pk" PRIMARY KEY("goal_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "goal_tag" ADD CONSTRAINT "goal_tag_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_tag" ADD CONSTRAINT "goal_tag_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;