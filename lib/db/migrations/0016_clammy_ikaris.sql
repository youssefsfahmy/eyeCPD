ALTER TABLE
    "profiles"
ADD
    COLUMN IF NOT EXISTS "email" varchar(255);

--> statement-breakpoint
ALTER TABLE
    "profiles" DROP CONSTRAINT IF EXISTS "profiles_email_unique";

--> statement-breakpoint
ALTER TABLE
    "profiles"
ALTER COLUMN
    "email" DROP NOT NULL;

--> statement-breakpoint
ALTER TABLE
    "profiles"
ALTER COLUMN
    "email" DROP DEFAULT;