CREATE TABLE "auth_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"event_type" text NOT NULL,
	"ip" text,
	"user_agent" text,
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "oauth_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"lookup_hash" text NOT NULL,
	"hashed_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"replaced_by_token_id" uuid,
	"user_agent" text,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_e164" text,
	"google_sub" text,
	"email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "auth_audit_logs" ADD CONSTRAINT "auth_audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_audit_logs_user_id_idx" ON "auth_audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_audit_logs_created_at_idx" ON "auth_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "oauth_accounts_provider_unique" ON "oauth_accounts" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "refresh_tokens_lookup_hash_unique" ON "refresh_tokens" USING btree ("lookup_hash");--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_e164_unique" ON "users" USING btree ("phone_e164");--> statement-breakpoint
CREATE UNIQUE INDEX "users_google_sub_unique" ON "users" USING btree ("google_sub");