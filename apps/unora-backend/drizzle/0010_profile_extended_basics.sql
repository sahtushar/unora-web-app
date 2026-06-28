ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "job_title" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "company_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "degree" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "school_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "hometown" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "height_cm" integer;
