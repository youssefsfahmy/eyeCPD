ALTER TABLE
    "profiles"
ADD
    COLUMN "roles" text [] DEFAULT '{"optometrist"}' NOT NULL;

--> statement-breakpoint
ALTER TABLE
    "profiles" DROP COLUMN "role";