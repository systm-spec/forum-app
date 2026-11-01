import "server-only";

import { and, asc, desc, eq, isNull, sql, type SQL } from "drizzle-orm";
import { connection } from "next/server";
import { getDatabase } from "@/lib/db";
import { comments, commentVotes, communities, communityMemberships, posts, postVotes, users } from "@/lib/db/schema";
import type { VoteValue } from "./types";

const postSelection = (viewerId: string | undefined) => ({
  id: posts.id,
  communitySlug: posts.communitySlug,
  authorId: posts.authorId,
  author: sql<string>`coalesce(${users.nickname}, ${posts.authorNickname})`,
  kind: posts.kind,
  title: posts.title,
  body: posts.body,
  createdAt: posts.createdAt,
  score: sql<number>`coalesce((select sum(${postVotes.value}) from ${postVotes} where ${postVotes.postId} = ${posts.id}), 0)::integer`,
  ownVote: viewerId
    ? sql<VoteValue>`coalesce((select ${postVotes.value} from ${postVotes} where ${postVotes.postId} = ${posts.id} and ${postVotes.userId} = ${viewerId}), 0)::integer`
    : sql<VoteValue>`0::integer`,
  commentCount: sql<number>`(select count(*)::integer from ${comments} where ${comments.postId} = ${posts.id})`,
});

const commentSelection = (viewerId: string | undefined) => ({
  id: comments.id,
  postId: comments.postId,
  parentId: comments.parentId,
  authorId: sql<string | null>`case when ${comments.deletedAt} is not null then null else ${comments.authorId} end`,
  author: sql<string>`case when ${comments.deletedAt} is not null then '' else coalesce(${users.nickname}, ${comments.authorNickname}) end`,
  body: comments.body,
  deletedAt: comments.deletedAt,
  createdAt: comments.createdAt,
  score: sql<number>`coalesce((select sum(${commentVotes.value}) from ${commentVotes} where ${commentVotes.commentId} = ${comments.id}), 0)::integer`,
  ownVote: viewerId
    ? sql<VoteValue>`coalesce((select ${commentVotes.value} from ${commentVotes} where ${commentVotes.commentId} = ${comments.id} and ${commentVotes.userId} = ${viewerId}), 0)::integer`
    : sql<VoteValue>`0::integer`,
});

export const getCommunities = async () => {
  await connection();
  return getDatabase().select({ id: communities.id, slug: communities.slug, name: communities.name, shortDescription: communities.shortDescription })
    .from(communities).orderBy(asc(communities.name), asc(communities.slug));
};

export const getCommunity = async (slug: string) => {
  await connection();
  const [community] = await getDatabase().select().from(communities).where(eq(communities.slug, slug)).limit(1);
  return community;
};

export const getPosts = async (viewerId?: string, filter: { communitySlug?: string; authorId?: string; id?: string } = {}) => {
  await connection();
  const conditions: SQL[] = [];
  if (filter.communitySlug) conditions.push(eq(posts.communitySlug, filter.communitySlug));
  if (filter.authorId) conditions.push(eq(posts.authorId, filter.authorId));
  if (filter.id) conditions.push(eq(posts.id, filter.id));
  return getDatabase().select(postSelection(viewerId)).from(posts).leftJoin(users, eq(posts.authorId, users.id))
    .where(and(...conditions)).orderBy(desc(posts.createdAt), asc(posts.id));
};

export const getComments = async (postId: string, viewerId?: string) => {
  await connection();
  return getDatabase().select(commentSelection(viewerId)).from(comments).leftJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.postId, postId)).orderBy(asc(comments.createdAt), asc(comments.id));
};

export const getPublicProfile = async (nickname: string) => {
  await connection();
  if (!/^[A-Za-z][A-Za-z0-9_]{2,23}$/.test(nickname)) return undefined;
  const [user] = await getDatabase().select({ id: users.id, nickname: users.nickname, createdAt: users.createdAt })
    .from(users).where(eq(users.normalizedNickname, nickname.toLowerCase())).limit(1);
  return user;
};

export const getProfileComments = async (authorId: string, viewerId?: string) => {
  await connection();
  return getDatabase().select({ ...commentSelection(viewerId), communitySlug: posts.communitySlug, postTitle: posts.title })
    .from(comments).innerJoin(posts, eq(comments.postId, posts.id)).leftJoin(users, eq(comments.authorId, users.id))
    .where(and(eq(comments.authorId, authorId), isNull(comments.deletedAt))).orderBy(desc(comments.createdAt), asc(comments.id));
};

export const getCommunityPostCount = async (communitySlug: string) => {
  await connection();
  const [result] = await getDatabase().select({ count: sql<number>`count(*)::integer` }).from(posts).where(eq(posts.communitySlug, communitySlug));
  return result.count;
};

export const isCommunityMember = async (communitySlug: string, userId: string) => {
  await connection();
  const [membership] = await getDatabase().select({ userId: communityMemberships.userId }).from(communityMemberships)
    .where(and(eq(communityMemberships.communitySlug, communitySlug), eq(communityMemberships.userId, userId))).limit(1);
  return Boolean(membership);
};
