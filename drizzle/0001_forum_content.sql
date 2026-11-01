CREATE TABLE "comment_votes" (
	"user_id" uuid NOT NULL,
	"comment_id" text NOT NULL,
	"value" smallint NOT NULL,
	CONSTRAINT "comment_votes_user_id_comment_id_pk" PRIMARY KEY("user_id","comment_id"),
	CONSTRAINT "comment_votes_value" CHECK ("comment_votes"."value" in (-1, 1))
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"post_id" text NOT NULL,
	"parent_id" text,
	"author_id" uuid,
	"author_nickname" varchar(24) NOT NULL,
	"body" text NOT NULL,
	"submission_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "comments_id_post_unique" UNIQUE("id","post_id"),
	CONSTRAINT "comments_author_submission_unique" UNIQUE("author_id","submission_id"),
	CONSTRAINT "comments_body_length" CHECK (char_length(btrim("comments"."body")) between 1 and 10000),
	CONSTRAINT "comments_not_own_parent" CHECK ("comments"."parent_id" is null or "comments"."parent_id" <> "comments"."id")
);
--> statement-breakpoint
CREATE TABLE "post_votes" (
	"user_id" uuid NOT NULL,
	"post_id" text NOT NULL,
	"value" smallint NOT NULL,
	CONSTRAINT "post_votes_user_id_post_id_pk" PRIMARY KEY("user_id","post_id"),
	CONSTRAINT "post_votes_value" CHECK ("post_votes"."value" in (-1, 1))
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"community_slug" varchar(64) NOT NULL,
	"author_id" uuid,
	"author_nickname" varchar(24) NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_title_length" CHECK (char_length("posts"."title") between 1 and 300)
);
--> statement-breakpoint
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_same_post_fk" FOREIGN KEY ("parent_id","post_id") REFERENCES "public"."comments"("id","post_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comment_votes_target_idx" ON "comment_votes" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX "comments_post_created_idx" ON "comments" USING btree ("post_id","created_at","id");--> statement-breakpoint
CREATE INDEX "comments_author_idx" ON "comments" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "post_votes_target_idx" ON "post_votes" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "posts_community_created_idx" ON "posts" USING btree ("community_slug","created_at","id");--> statement-breakpoint
CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
--> statement-breakpoint
-- Vorhandene Texte und URLs erhalten. Keine Konten zuweisen oder Stimmen erfinden.
INSERT INTO "posts" ("id", "community_slug", "author_nickname", "title", "body") VALUES
('kleine-projekte', 'werkstatt', 'mira', 'Welche kleinen Projekte haben euch zuletzt etwas Neues beigebracht?', 'Ich habe am Wochenende eine alte Lampe repariert. Das Ergebnis war unspektakulär, aber die Suche nach dem eigentlichen Fehler hat überraschend viel Spaß gemacht. Was war euer letztes kleines Lernprojekt?'),
('morgenroutine', 'alltag', 'tariq', 'Eine ruhigere Morgenroutine ohne festen Stundenplan', 'Ich versuche seit ein paar Wochen, den Tag mit zehn Minuten ohne Bildschirm zu beginnen. Kein großes System, nur ein kurzer Moment zum Ankommen. Welche einfachen Gewohnheiten funktionieren für euch?'),
('buchnotizen', 'lesezeichen', 'jule', 'Wie haltet ihr Gedanken aus Büchern fest, ohne das Lesen zu unterbrechen?', 'Mein Stapel mit Notizzetteln wächst schneller als meine eigentlichen Notizen. Ich suche eine Methode, die leicht genug ist, dass ich auch wirklich dabeibleibe.'),
('arbeitsplatz', 'werkstatt', 'noah', 'Ein aufgeräumter Arbeitsplatz mit wenig Platz', 'Meine kleine Ecke zu Hause soll gleichzeitig Platz für Elektronik und Papierarbeiten bieten. Habt ihr Ideen für flexible Aufbewahrung, die nicht gleich den ganzen Raum einnimmt?')
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "comments" ("id", "post_id", "parent_id", "author_nickname", "body") VALUES
('c1', 'kleine-projekte', NULL, 'noah', 'Ich habe einen kaputten Kopfhörer geöffnet und zum ersten Mal selbst ein Kabel neu verlötet. Der schwierigste Teil war tatsächlich das Gehäuse wieder zu schließen.'),
('c2', 'kleine-projekte', 'c1', 'mira', 'Das kenne ich. Bei meiner Lampe war das Zusammenbauen auch die eigentliche Geduldsprobe.'),
('c3', 'kleine-projekte', 'c2', 'noah', 'Immerhin weiß man beim nächsten Mal schon, welche Schraube wohin gehört.'),
('c4', 'kleine-projekte', NULL, 'jule', 'Ich habe ein kleines Regal gebaut. Dabei gelernt: Zweimal messen lohnt sich wirklich.'),
('c5', 'morgenroutine', NULL, 'mira', 'Ich bereite abends meinen Tee für morgens vor. Klingt klein, macht den Start aber viel entspannter.'),
('c6', 'morgenroutine', 'c5', 'tariq', 'Das probiere ich morgen aus. Danke für die Idee!'),
('c7', 'buchnotizen', NULL, 'eli', 'Ich markiere nur Stellen und schreibe nach jedem Kapitel drei Sätze dazu. So bleibt der Lesefluss erhalten.'),
('c8', 'buchnotizen', 'c7', 'jule', 'Drei Sätze sind eine gute Grenze. Das klingt machbar.'),
('c9', 'buchnotizen', NULL, 'tariq', 'Ein Lesezeichen mit Platz für ein Stichwort reicht mir oft schon.'),
('c10', 'arbeitsplatz', NULL, 'eli', 'Eine flache Werkzeugbox unter dem Tisch spart bei mir am meisten Platz.')
ON CONFLICT ("id") DO NOTHING;
