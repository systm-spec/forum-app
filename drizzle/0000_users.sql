CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nickname" varchar(24) NOT NULL,
	"normalized_nickname" varchar(24) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_nickname_format" CHECK ("users"."nickname" ~ '^[A-Za-z][A-Za-z0-9_]{2,23}$'),
	CONSTRAINT "users_nickname_normalized" CHECK ("users"."normalized_nickname" = lower("users"."nickname"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "users_normalized_nickname_unique" ON "users" USING btree ("normalized_nickname");