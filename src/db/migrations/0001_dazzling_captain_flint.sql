ALTER TABLE "users" ADD COLUMN "reset_token" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_token_expiry" timestamp;