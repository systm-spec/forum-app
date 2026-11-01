CREATE TABLE "mod_permissions" (
	"id" smallint PRIMARY KEY DEFAULT 1 NOT NULL,
	"delete_communities" boolean DEFAULT false NOT NULL,
	"delete_posts" boolean DEFAULT false NOT NULL,
	"delete_comments" boolean DEFAULT false NOT NULL,
	CONSTRAINT "mod_permissions_single_row" CHECK ("mod_permissions"."id" = 1)
);
--> statement-breakpoint
INSERT INTO "mod_permissions" ("id") VALUES (1);
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_body_length";--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(4) DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_body_length" CHECK (("comments"."deleted_at" is null and char_length(btrim("comments"."body")) between 1 and 10000) or ("comments"."deleted_at" is not null and "comments"."body" = ''));--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_valid" CHECK ("users"."role" in ('user', 'mod'));
