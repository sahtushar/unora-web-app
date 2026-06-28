ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "location" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "user_location" jsonb;
