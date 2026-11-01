import { sql } from "drizzle-orm";
import { check, foreignKey, index, pgTable, primaryKey, smallint, text, timestamp, unique, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

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

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  communitySlug: varchar("community_slug", { length: 64 }).notNull(),
  authorId: uuid("author_id").references(() => users.id),
  authorNickname: varchar("author_nickname", { length: 24 }).notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("posts_community_created_idx").on(table.communitySlug, table.createdAt, table.id),
  index("posts_author_idx").on(table.authorId),
  check("posts_title_length", sql`char_length(${table.title}) between 1 and 300`),
]);

export const comments = pgTable("comments", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  postId: text("post_id").notNull().references(() => posts.id),
  parentId: text("parent_id"),
  authorId: uuid("author_id").references(() => users.id),
  authorNickname: varchar("author_nickname", { length: 24 }).notNull(),
  body: text("body").notNull(),
  submissionId: uuid("submission_id").defaultRandom().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  unique("comments_id_post_unique").on(table.id, table.postId),
  foreignKey({
    name: "comments_parent_same_post_fk",
    columns: [table.parentId, table.postId],
    foreignColumns: [table.id, table.postId],
  }),
  unique("comments_author_submission_unique").on(table.authorId, table.submissionId),
  index("comments_post_created_idx").on(table.postId, table.createdAt, table.id),
  index("comments_author_idx").on(table.authorId),
  check("comments_body_length", sql`char_length(btrim(${table.body})) between 1 and 10000`),
  check("comments_not_own_parent", sql`${table.parentId} is null or ${table.parentId} <> ${table.id}`),
]);

export const postVotes = pgTable("post_votes", {
  userId: uuid("user_id").notNull().references(() => users.id),
  postId: text("post_id").notNull().references(() => posts.id),
  value: smallint("value").notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.postId] }),
  index("post_votes_target_idx").on(table.postId),
  check("post_votes_value", sql`${table.value} in (-1, 1)`),
]);

export const commentVotes = pgTable("comment_votes", {
  userId: uuid("user_id").notNull().references(() => users.id),
  commentId: text("comment_id").notNull().references(() => comments.id),
  value: smallint("value").notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.commentId] }),
  index("comment_votes_target_idx").on(table.commentId),
  check("comment_votes_value", sql`${table.value} in (-1, 1)`),
]);
