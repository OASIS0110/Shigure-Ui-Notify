import { pgTable, bigserial, varchar, timestamp, foreignKey, bigint, text, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const youtubers = pgTable("youtubers", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	channelId: varchar("channel_id", { length: 100 }).notNull(),
	handleName: varchar("handle_name", { length: 100 }),
	channelName: varchar("channel_name", { length: 100 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	pubsubExpireAt: timestamp("pubsub_expire_at", { mode: 'string' }),
});

export const streamSchedules = pgTable("stream_schedules", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	videoId: varchar("video_id", { length: 100 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	youtuberId: bigint("youtuber_id", { mode: "number" }).notNull(),
	streamTitle: varchar("stream_title", { length: 255 }).notNull(),
	streamDescription: text("stream_description"),
	streamStartAt: timestamp("stream_start_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	streamStarted: boolean("stream_started").default(false),
}, (table) => [
	foreignKey({
			columns: [table.youtuberId],
			foreignColumns: [youtubers.id],
			name: "stream_schedules_youtuber_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const notificationUsers = pgTable("notification_users", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 18 }).notNull(),
	userName: varchar("user_name", { length: 100 }).notNull(),
	membersOnlyVideo: boolean("members_only_video").default(true),
	collaboration: boolean().default(true),
	disable: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const notificationServers = pgTable("notification_servers", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	guildId: varchar("guild_id", { length: 18 }).notNull(),
	channelId: varchar("channel_id", { length: 18 }).notNull(),
	membersOnlyVideo: boolean("members_only_video").default(true),
	collaboration: boolean().default(true),
	disable: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
