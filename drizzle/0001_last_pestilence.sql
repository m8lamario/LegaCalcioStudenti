CREATE TYPE "public"."phase_kind" AS ENUM('group', 'knockout');--> statement-breakpoint
CREATE TABLE "competition_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"key" text NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phase_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matchday_awards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"round_label" text NOT NULL,
	"player_id" uuid,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "sponsor_clicks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slot_id" uuid NOT NULL,
	"sponsor_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsor_impressions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slot_id" uuid NOT NULL,
	"sponsor_id" uuid NOT NULL,
	"day" date NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"photo" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "tickets_url" text;--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "tickets_active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "regulations_url" text;--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "contacts" jsonb;--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "standings_rules" jsonb;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "group_id" uuid;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "round_number" integer;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "legacy_slug" text;--> statement-breakpoint
ALTER TABLE "phases" ADD COLUMN "kind" "phase_kind" DEFAULT 'group' NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "group_id" uuid;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "slug" text;--> statement-breakpoint
UPDATE "teams" SET "slug" = lower(regexp_replace(coalesce("name", 'squadra'), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring("id"::text, 1, 8) WHERE "slug" IS NULL;--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "lat" real;--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "lon" real;--> statement-breakpoint
ALTER TABLE "venues" ADD COLUMN "maps_url" text;--> statement-breakpoint
ALTER TABLE "competition_blocks" ADD CONSTRAINT "competition_blocks_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_phase_id_phases_id_fk" FOREIGN KEY ("phase_id") REFERENCES "public"."phases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchday_awards" ADD CONSTRAINT "matchday_awards_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matchday_awards" ADD CONSTRAINT "matchday_awards_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_clicks" ADD CONSTRAINT "sponsor_clicks_slot_id_sponsor_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."sponsor_slots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_clicks" ADD CONSTRAINT "sponsor_clicks_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_impressions" ADD CONSTRAINT "sponsor_impressions_slot_id_sponsor_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."sponsor_slots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsor_impressions" ADD CONSTRAINT "sponsor_impressions_sponsor_id_sponsors_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_members" ADD CONSTRAINT "staff_members_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "competition_blocks_key_idx" ON "competition_blocks" USING btree ("competition_id","key");--> statement-breakpoint
CREATE UNIQUE INDEX "groups_phase_slug_idx" ON "groups" USING btree ("phase_id","slug");--> statement-breakpoint
CREATE INDEX "groups_phase_idx" ON "groups" USING btree ("phase_id");--> statement-breakpoint
CREATE INDEX "matchday_awards_competition_idx" ON "matchday_awards" USING btree ("competition_id");--> statement-breakpoint
CREATE INDEX "sponsor_clicks_slot_idx" ON "sponsor_clicks" USING btree ("slot_id");--> statement-breakpoint
CREATE INDEX "sponsor_clicks_created_idx" ON "sponsor_clicks" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "sponsor_impressions_day_idx" ON "sponsor_impressions" USING btree ("slot_id","day");--> statement-breakpoint
CREATE INDEX "staff_members_competition_idx" ON "staff_members" USING btree ("competition_id");--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "matches_legacy_slug_idx" ON "matches" USING btree ("legacy_slug");--> statement-breakpoint
CREATE INDEX "matches_group_idx" ON "matches" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "sponsor_slots_placement_idx" ON "sponsor_slots" USING btree ("placement");--> statement-breakpoint
CREATE UNIQUE INDEX "teams_competition_slug_idx" ON "teams" USING btree ("competition_id","slug");--> statement-breakpoint
CREATE INDEX "teams_group_idx" ON "teams" USING btree ("group_id");