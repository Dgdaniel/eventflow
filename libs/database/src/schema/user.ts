import { pgTable, uuid, varchar, pgEnum, timestamp } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['USER', 'ORGANIZER', 'ADMIN']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  password: varchar('password', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('USER'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
