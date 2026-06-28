CREATE TABLE "user_match_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"age_max" integer DEFAULT 99 NOT NULL,
	"age_min" integer DEFAULT 18 NOT NULL,
	"distance_km" integer DEFAULT 50 NOT NULL,
	"seeking" text[] DEFAULT '{}'::text[] NOT NULL,
	"intentions" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_match_preferences" ADD CONSTRAINT "user_match_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;