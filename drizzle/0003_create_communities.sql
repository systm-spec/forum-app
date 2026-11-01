ALTER TABLE "communities" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "topic_boundary" text;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "creator_id" uuid;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "submission_id" uuid;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_creator_submission_unique" UNIQUE("creator_id","submission_id");--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_name_length" CHECK (char_length(btrim("communities"."name")) between 3 and 100);--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_short_description_length" CHECK (char_length(btrim("communities"."short_description")) between 10 and 160);--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_topic_boundary_length" CHECK ("communities"."topic_boundary" is null or char_length(btrim("communities"."topic_boundary")) between 10 and 1000);