ALTER TABLE "user_photos" ADD COLUMN "object_data" bytea;--> statement-breakpoint
ALTER TABLE "user_photos" ADD COLUMN "object_content_type" text;