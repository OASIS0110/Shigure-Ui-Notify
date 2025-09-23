import { relations } from "drizzle-orm/relations";
import { youtubers, streamSchedules } from "./schema";

export const streamSchedulesRelations = relations(streamSchedules, ({one}) => ({
	youtuber: one(youtubers, {
		fields: [streamSchedules.youtuberId],
		references: [youtubers.id]
	}),
}));

export const youtubersRelations = relations(youtubers, ({many}) => ({
	streamSchedules: many(streamSchedules),
}));