import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
export type PostBodyBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "staff_citta",
  "refertista",
]);

export const competitionStatusEnum = pgEnum("competition_status", [
  "draft",
  "published",
  "archived",
]);

export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
  "postponed",
]);

export const matchEventTypeEnum = pgEnum("match_event_type", [
  "goal",
  "yellow_card",
  "red_card",
  "substitution",
  "note",
]);

export const matchClockPeriodEnum = pgEnum("match_clock_period", [
  "idle",
  "first",
  "interval",
  "second",
  "extra_first",
  "extra_interval",
  "extra_second",
  "penalties",
  "closed",
]);

export const matchGoalKindEnum = pgEnum("match_goal_kind", [
  "regular",
  "penalty",
  "own_goal",
]);

export const postKindEnum = pgEnum("post_kind", ["blog", "news"]);

export const phaseKindEnum = pgEnum("phase_kind", ["group", "knockout"]);

export type StandingsTieBreaker =
  | "points"
  | "head_to_head"
  | "goal_difference"
  | "goals_for"
  | "name";

export type StandingsRules = {
  winPoints: number;
  drawPoints: number;
  lossPoints: number;
  tieBreakers: StandingsTieBreaker[];
};

export type CompetitionContacts = {
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
};

export const CUP_BLOCK_KEYS = [
  "title_sponsor",
  "hero",
  "match_strip",
  "tabs",
  "results_upcoming",
  "standings",
  "scorers",
  "news",
  "schools",
  "local_partners",
  "info",
  "national_partners",
] as const;

export type CupBlockKey = (typeof CUP_BLOCK_KEYS)[number];

export const SPONSOR_PLACEMENTS = [
  "title_coppa",
  "nazionale",
  "live",
  "mvp",
  "gold_locale",
  "silver_locale",
  "tecnico",
] as const;

export type SponsorPlacement = (typeof SPONSOR_PLACEMENTS)[number];

export const loginRequestStatusEnum = pgEnum("login_request_status", [
  "pending",
  "confirmed",
  "used",
  "expired",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    role: userRoleEnum("role").notNull().default("staff_citta"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const cities = pgTable(
  "cities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    region: text("region"),
    lat: real("lat"),
    lon: real("lon"),
    mapCalloutDx: real("map_callout_dx"),
    mapCalloutDy: real("map_callout_dy"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("cities_slug_idx").on(table.slug)],
);

export const userCities = pgTable(
  "user_cities",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.cityId] })],
);

export const competitions = pgTable(
  "competitions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    cityId: uuid("city_id").references(() => cities.id, { onDelete: "set null" }),
    regionTag: text("region_tag"),
    season: text("season"),
    status: competitionStatusEnum("status").notNull().default("published"),
    stageLabel: text("stage_label"),
    logo: text("logo"),
    image: text("image"),
    imageAlt: text("image_alt"),
    description: text("description"),
    colors: jsonb("colors").$type<Record<string, string>>(),
    social: jsonb("social").$type<Record<string, string>>(),
    hero: jsonb("hero").$type<Record<string, string>>(),
    ticketsUrl: text("tickets_url"),
    ticketsActive: boolean("tickets_active").notNull().default(false),
    regulationsUrl: text("regulations_url"),
    contacts: jsonb("contacts").$type<CompetitionContacts>(),
    standingsRules: jsonb("standings_rules").$type<StandingsRules>(),
    halfMinutes: integer("half_minutes").notNull().default(25),
    extraHalfMinutes: integer("extra_half_minutes").notNull().default(10),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("competitions_slug_idx").on(table.slug),
    index("competitions_city_idx").on(table.cityId),
    index("competitions_status_idx").on(table.status),
  ],
);

export const phases = pgTable(
  "phases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    kind: phaseKindEnum("kind").notNull().default("group"),
    startsOn: date("starts_on"),
    endsOn: date("ends_on"),
    halfMinutes: integer("half_minutes"),
    extraHalfMinutes: integer("extra_half_minutes"),
    allowExtraTime: boolean("allow_extra_time").notNull().default(false),
    allowPenalties: boolean("allow_penalties").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    uniqueIndex("phases_competition_slug_idx").on(table.competitionId, table.slug),
    index("phases_competition_idx").on(table.competitionId),
  ],
);

export const venues = pgTable(
  "venues",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cityId: uuid("city_id").references(() => cities.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    address: text("address"),
    lat: real("lat"),
    lon: real("lon"),
    mapsUrl: text("maps_url"),
  },
  (table) => [index("venues_city_idx").on(table.cityId)],
);

export const schools = pgTable(
  "schools",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cityId: uuid("city_id").references(() => cities.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
  },
  (table) => [
    uniqueIndex("schools_slug_idx").on(table.slug),
    index("schools_city_idx").on(table.cityId),
  ],
);

export const groups = pgTable(
  "groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    phaseId: uuid("phase_id")
      .notNull()
      .references(() => phases.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    uniqueIndex("groups_phase_slug_idx").on(table.phaseId, table.slug),
    index("groups_phase_idx").on(table.phaseId),
  ],
);

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id, { onDelete: "cascade" }),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    phaseId: uuid("phase_id").references(() => phases.id, { onDelete: "set null" }),
    groupId: uuid("group_id").references(() => groups.id, { onDelete: "set null" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    logo: text("logo"),
  },
  (table) => [
    uniqueIndex("teams_competition_slug_idx").on(table.competitionId, table.slug),
    index("teams_competition_idx").on(table.competitionId),
    index("teams_school_idx").on(table.schoolId),
    index("teams_group_idx").on(table.groupId),
  ],
);

export const players = pgTable(
  "players",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    number: integer("number"),
    position: text("position"),
    publicationConsent: boolean("publication_consent").notNull().default(false),
  },
  (table) => [index("players_team_idx").on(table.teamId)],
);

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    phaseId: uuid("phase_id").references(() => phases.id, { onDelete: "set null" }),
    groupId: uuid("group_id").references(() => groups.id, { onDelete: "set null" }),
    venueId: uuid("venue_id").references(() => venues.id, { onDelete: "set null" }),
    kickoffAt: timestamp("kickoff_at", { withTimezone: true }),
    roundLabel: text("round_label"),
    roundNumber: integer("round_number"),
    dateLabel: text("date_label"),
    legacySlug: text("legacy_slug"),
    homeTeamId: uuid("home_team_id").references(() => teams.id, { onDelete: "set null" }),
    awayTeamId: uuid("away_team_id").references(() => teams.id, { onDelete: "set null" }),
    homeScore: integer("home_score"),
    awayScore: integer("away_score"),
    status: matchStatusEnum("status").notNull().default("scheduled"),
    clockPeriod: matchClockPeriodEnum("clock_period").notNull().default("idle"),
    periodStartedAt: timestamp("period_started_at", { withTimezone: true }),
    elapsedSeconds: integer("elapsed_seconds").notNull().default(0),
    halfMinutes: integer("half_minutes").notNull().default(25),
    extraHalfMinutes: integer("extra_half_minutes").notNull().default(10),
    allowExtraTime: boolean("allow_extra_time").notNull().default(false),
    allowPenalties: boolean("allow_penalties").notNull().default(false),
    homePenaltyScore: integer("home_penalty_score").notNull().default(0),
    awayPenaltyScore: integer("away_penalty_score").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("matches_legacy_slug_idx").on(table.legacySlug),
    index("matches_competition_idx").on(table.competitionId),
    index("matches_phase_idx").on(table.phaseId),
    index("matches_group_idx").on(table.groupId),
    index("matches_kickoff_idx").on(table.kickoffAt),
    index("matches_status_idx").on(table.status),
  ],
);

export const staffMembers = pgTable(
  "staff_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    role: text("role").notNull(),
    photo: text("photo"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("staff_members_competition_idx").on(table.competitionId)],
);

export const matchdayAwards = pgTable(
  "matchday_awards",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    roundLabel: text("round_label").notNull(),
    playerId: uuid("player_id").references(() => players.id, { onDelete: "set null" }),
    note: text("note"),
  },
  (table) => [index("matchday_awards_competition_idx").on(table.competitionId)],
);

export const competitionBlocks = pgTable(
  "competition_blocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    visible: boolean("visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    uniqueIndex("competition_blocks_key_idx").on(table.competitionId, table.key),
  ],
);

export const matchEvents = pgTable(
  "match_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "set null" }),
    playerId: uuid("player_id").references(() => players.id, { onDelete: "set null" }),
    type: matchEventTypeEnum("type").notNull(),
    minute: integer("minute"),
    note: text("note"),
    goalKind: matchGoalKindEnum("goal_kind").notNull().default("regular"),
    assistPlayerId: uuid("assist_player_id").references(() => players.id, {
      onDelete: "set null",
    }),
    shirtNumber: integer("shirt_number"),
    playerOutId: uuid("player_out_id").references(() => players.id, {
      onDelete: "set null",
    }),
    clientId: text("client_id"),
    shootout: boolean("shootout").notNull().default(false),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("match_events_match_idx").on(table.matchId),
    uniqueIndex("match_events_client_id_idx").on(table.clientId),
  ],
);

export const liveCommands = pgTable(
  "live_commands",
  {
    clientId: text("client_id").primaryKey(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    kind: text("kind").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("live_commands_match_idx").on(table.matchId)],
);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    competitionId: uuid("competition_id").references(() => competitions.id, {
      onDelete: "set null",
    }),
    kind: postKindEnum("kind").notNull().default("blog"),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    dek: text("dek").notNull().default(""),
    authors: jsonb("authors").$type<string[]>().notNull().default([]),
    dateLabel: text("date_label").notNull().default(""),
    dateIso: date("date_iso").notNull(),
    image: text("image").notNull(),
    imageAlt: text("image_alt").notNull().default(""),
    imageCredit: text("image_credit"),
    body: jsonb("body").$type<PostBodyBlock[]>().notNull().default([]),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("posts_competition_slug_idx").on(table.competitionId, table.slug),
    index("posts_slug_idx").on(table.slug),
    index("posts_published_idx").on(table.published),
  ],
);

export const sponsors = pgTable("sponsors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  kind: text("kind").notNull().default("sponsor"),
  logo: text("logo"),
  href: text("href"),
});

export const sponsorSlots = pgTable(
  "sponsor_slots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sponsorId: uuid("sponsor_id")
      .notNull()
      .references(() => sponsors.id, { onDelete: "cascade" }),
    competitionId: uuid("competition_id").references(() => competitions.id, {
      onDelete: "cascade",
    }),
    placement: text("placement").notNull().default("home"),
    startsOn: date("starts_on"),
    endsOn: date("ends_on"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("sponsor_slots_competition_idx").on(table.competitionId),
    index("sponsor_slots_sponsor_idx").on(table.sponsorId),
    index("sponsor_slots_placement_idx").on(table.placement),
  ],
);

export const sponsorClicks = pgTable(
  "sponsor_clicks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slotId: uuid("slot_id")
      .notNull()
      .references(() => sponsorSlots.id, { onDelete: "cascade" }),
    sponsorId: uuid("sponsor_id")
      .notNull()
      .references(() => sponsors.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("sponsor_clicks_slot_idx").on(table.slotId),
    index("sponsor_clicks_created_idx").on(table.createdAt),
  ],
);

export const sponsorImpressions = pgTable(
  "sponsor_impressions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slotId: uuid("slot_id")
      .notNull()
      .references(() => sponsorSlots.id, { onDelete: "cascade" }),
    sponsorId: uuid("sponsor_id")
      .notNull()
      .references(() => sponsors.id, { onDelete: "cascade" }),
    day: date("day").notNull(),
    count: integer("count").notNull().default(0),
  },
  (table) => [
    uniqueIndex("sponsor_impressions_day_idx").on(table.slotId, table.day),
  ],
);

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const homeBlocks = pgTable(
  "home_blocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: text("key").notNull(),
    title: text("title"),
    payload: jsonb("payload").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("home_blocks_key_idx").on(table.key)],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_log_created_idx").on(table.createdAt),
    index("audit_log_user_idx").on(table.userId),
  ],
);

export const loginRequests = pgTable(
  "login_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    tokenHash: text("token_hash").notNull(),
    status: loginRequestStatusEnum("status").notNull().default("pending"),
    ip: text("ip"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("login_requests_token_hash_idx").on(table.tokenHash),
    index("login_requests_email_idx").on(table.email),
    index("login_requests_status_idx").on(table.status),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_idx").on(table.tokenHash),
    index("sessions_user_idx").on(table.userId),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  cities: many(userCities),
  sessions: many(sessions),
  auditEntries: many(auditLog),
}));

export const citiesRelations = relations(cities, ({ many }) => ({
  competitions: many(competitions),
  userCities: many(userCities),
  venues: many(venues),
  schools: many(schools),
}));

export const userCitiesRelations = relations(userCities, ({ one }) => ({
  user: one(users, { fields: [userCities.userId], references: [users.id] }),
  city: one(cities, { fields: [userCities.cityId], references: [cities.id] }),
}));

export const competitionsRelations = relations(competitions, ({ one, many }) => ({
  city: one(cities, { fields: [competitions.cityId], references: [cities.id] }),
  phases: many(phases),
  teams: many(teams),
  matches: many(matches),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  competition: one(competitions, {
    fields: [posts.competitionId],
    references: [competitions.id],
  }),
}));
