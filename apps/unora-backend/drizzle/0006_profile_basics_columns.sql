ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "display_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "gender" text;
