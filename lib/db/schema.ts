import { sql } from "drizzle-orm";
import { boolean, check, foreignKey, index, pgTable, primaryKey, smallint, text, timestamp, unique, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  nickname: varchar("nickname", { length: 24 }).notNull(),
  normalizedNickname: varchar("normalized_nickname", { length: 24 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 4, enum: ["user", "mod"] }).default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("users_normalized_nickname_unique").on(table.normalizedNickname),
  check("users_nickname_format", sql`${table.nickname} ~ '^[A-Za-z][A-Za-z0-9_]{2,23}$'`),
  check("users_nickname_normalized", sql`${table.normalizedNickname} = lower(${table.nickname})`),
  check("users_role_valid", sql`${table.role} in ('user', 'mod')`),
]);

export const modPermissions = pgTable("mod_permissions", {
  id: smallint("id").primaryKey().default(1),
  deleteCommunities: boolean("delete_communities").default(false).notNull(),
  deletePosts: boolean("delete_posts").default(false).notNull(),
  deleteComments: boolean("delete_comments").default(false).notNull(),
}, (table) => [check("mod_permissions_single_row", sql`${table.id} = 1`)]);

export const communities = pgTable("communities", {
  id: uuid("id").defaultRandom().notNull(),
  slug: varchar("slug", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  shortDescription: varchar("short_description", { length: 160 }).notNull(),
  topicBoundary: text("topic_boundary"),
  creatorId: uuid("creator_id").references(() => users.id),
  submissionId: uuid("submission_id"),
}, (table) => [
  unique("communities_id_unique").on(table.id),
  unique("communities_creator_submission_unique").on(table.creatorId, table.submissionId),
  check("communities_name_length", sql`char_length(btrim(${table.name})) between 3 and 100`),
  check("communities_short_description_length", sql`char_length(btrim(${table.shortDescription})) between 10 and 160`),
  check("communities_topic_boundary_length", sql`${table.topicBoundary} is null or char_length(btrim(${table.topicBoundary})) between 10 and 1000`),
]);

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  communitySlug: varchar("community_slug", { length: 64 }).notNull().references(() => communities.slug),
  authorId: uuid("author_id").references(() => users.id),
  authorNickname: varchar("author_nickname", { length: 24 }).notNull(),
  kind: varchar("kind", { length: 16, enum: ["question", "thesis", "solution"] }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  submissionId: uuid("submission_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("posts_community_created_idx").on(table.communitySlug, table.createdAt, table.id),
  index("posts_author_idx").on(table.authorId),
  unique("posts_author_submission_unique").on(table.authorId, table.submissionId),
  check("posts_title_length", sql`char_length(${table.title}) between 1 and 300`),
  check("posts_kind_valid", sql`${table.kind} is null or ${table.kind} in ('question', 'thesis', 'solution')`),
  check("posts_body_length", sql`char_length(btrim(${table.body})) between 1 and 10000`),
]);

export const communityMemberships = pgTable("community_memberships", {
  userId: uuid("user_id").notNull().references(() => users.id),
  communitySlug: varchar("community_slug", { length: 64 }).notNull().references(() => communities.slug),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.communitySlug] }),
  index("community_memberships_community_idx").on(table.communitySlug),
]);

export const comments = pgTable("comments", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()::text`),
  postId: text("post_id").notNull().references(() => posts.id),
  parentId: text("parent_id"),
  authorId: uuid("author_id").references(() => users.id),
  authorNickname: varchar("author_nickname", { length: 24 }).notNull(),
  body: text("body").notNull(),
  submissionId: uuid("submission_id").defaultRandom().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
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
  check("comments_body_length", sql`(${table.deletedAt} is null and char_length(btrim(${table.body})) between 1 and 10000) or (${table.deletedAt} is not null and ${table.body} = '')`),
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
