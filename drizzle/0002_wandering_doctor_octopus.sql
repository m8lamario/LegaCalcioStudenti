CREATE TYPE "public"."match_clock_period" AS ENUM('idle', 'first', 'interval', 'second', 'extra_first', 'extra_interval', 'extra_second', 'penalties', 'closed');--> statement-breakpoint
CREATE TYPE "public"."match_goal_kind" AS ENUM('regular', 'penalty', 'own_goal');--> statement-breakpoint
ALTER TYPE "public"."match_event_type" ADD VALUE 'note';--> statement-breakpoint
CREATE TABLE "live_commands" (
	"client_id" text PRIMARY KEY NOT NULL,
	"match_id" uuid NOT NULL,
	"user_id" uuid,
	"kind" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "half_minutes" integer DEFAULT 25 NOT NULL;--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "extra_half_minutes" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "match_events" ADD COLUMN "goal_kind" "match_goal_kind" DEFAULT 'regular' NOT NULL;--> statement-breakpoint
ALTER TABLE "match_events" ADD COLUMN "assist_player_id" uuid;--> statement-breakpoint
ALTER TABLE "match_events" ADD COLUMN "shirt_number" integer;--> statement-breakpoint
ALTER TABLE "match_events" ADD COLUMN "player_out_id" uuid;--> statement-breakpoint
ALTER TABLE "match_events" ADD COLUMN "client_id" text;--> statement-breakpoint
ALTER TABLE "match_events" ADD COLUMN "shootout" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "match_events" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "match_events" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "clock_period" "match_clock_period" DEFAULT 'idle' NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "period_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "elapsed_seconds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "half_minutes" integer DEFAULT 25 NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "extra_half_minutes" integer DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "allow_extra_time" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "allow_penalties" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "home_penalty_score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "away_penalty_score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "phases" ADD COLUMN "half_minutes" integer;--> statement-breakpoint
ALTER TABLE "phases" ADD COLUMN "extra_half_minutes" integer;--> statement-breakpoint
ALTER TABLE "phases" ADD COLUMN "allow_extra_time" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "phases" ADD COLUMN "allow_penalties" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "live_commands" ADD CONSTRAINT "live_commands_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "live_commands" ADD CONSTRAINT "live_commands_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "live_commands_match_idx" ON "live_commands" USING btree ("match_id");--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_assist_player_id_players_id_fk" FOREIGN KEY ("assist_player_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_player_out_id_players_id_fk" FOREIGN KEY ("player_out_id") REFERENCES "public"."players"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "match_events_client_id_idx" ON "match_events" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "matches_status_idx" ON "matches" USING btree ("status");