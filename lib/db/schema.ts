import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  nickname: varchar("nickname", { length: 24 }).notNull(),
  normalizedNickname: varchar("normalized_nickname", { length: 24 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("users_normalized_nickname_unique").on(table.normalizedNickname),
  check("users_nickname_format", sql`${table.nickname} ~ '^[A-Za-z][A-Za-z0-9_]{2,23}$'`),
  check("users_nickname_normalized", sql`${table.normalizedNickname} = lower(${table.nickname})`),
]);
