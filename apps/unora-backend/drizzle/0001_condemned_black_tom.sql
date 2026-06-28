CREATE TABLE "user_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"storage_key" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"alt" text,
	"blur_data_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_photos" ADD CONSTRAINT "user_photos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_photos_user_id_idx" ON "user_photos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_photos_user_id_sort_order_idx" ON "user_photos" USING btree ("user_id","sort_order");