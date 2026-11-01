CREATE TABLE "communities" (
	"slug" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"short_description" varchar(160) NOT NULL
);
--> statement-breakpoint
INSERT INTO "communities" ("slug", "name", "description", "short_description") VALUES
('werkstatt', 'Werkstatt', 'Ein Raum für Projekte, kleine Experimente und die Fragen dazwischen.', 'Ideen und Projekte'),
('alltag', 'Alltag', 'Was den Tag leichter macht: Routinen, Beobachtungen und praktische Tipps.', 'Leben und Routinen'),
('lesezeichen', 'Lesezeichen', 'Bücher, Artikel und Gedanken, die länger im Kopf bleiben.', 'Lesen und Entdecken');
--> statement-breakpoint
CREATE TABLE "community_memberships" (
	"user_id" uuid NOT NULL,
	"community_slug" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "community_memberships_user_id_community_slug_pk" PRIMARY KEY("user_id","community_slug")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "kind" varchar(16);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "submission_id" uuid;--> statement-breakpoint
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_community_slug_communities_slug_fk" FOREIGN KEY ("community_slug") REFERENCES "public"."communities"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "community_memberships_community_idx" ON "community_memberships" USING btree ("community_slug");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_community_slug_communities_slug_fk" FOREIGN KEY ("community_slug") REFERENCES "public"."communities"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_submission_unique" UNIQUE("author_id","submission_id");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_kind_valid" CHECK ("posts"."kind" is null or "posts"."kind" in ('question', 'thesis', 'solution'));--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_body_length" CHECK (char_length(btrim("posts"."body")) between 1 and 10000);
