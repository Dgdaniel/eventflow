import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { users } from "./user";

export const  eventStatusEnum = pgEnum("event_status", ["DRAFT", "PUBLISHED", "CANCELLED"])

export const events = pgTable("events", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    date: timestamp("date").notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    capacity: integer("capacity").notNull(),
    price: integer("price").notNull(),
    organizerId: uuid("organizer_id").references(() => users.id).notNull(),
    status: eventStatusEnum("status").notNull().default("DRAFT"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

export type Events = typeof events.$inferSelect
export type NewEvents = typeof events.$inferInsert