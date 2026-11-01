"use server";

import { and, asc, eq, inArray } from "drizzle-orm";
import { refresh, revalidatePath } from "next/cache";
import { can, getCurrentAccess, type Permission } from "@/lib/auth/access";
import { getDatabase } from "@/lib/db";
import { comments, commentVotes, communities, communityMemberships, posts, postVotes } from "@/lib/db/schema";
import { threadPath } from "@/lib/format";

type DeleteResult = { ok: true; redirectTo?: string } | { ok: false; message: string; loginRequired?: boolean };
const validId = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9][a-z0-9_-]{0,127}$/i.test(value);

const authorize = async (permission: Permission): Promise<DeleteResult | null> => {
  const access = await getCurrentAccess();
  if (!access) return { ok: false, loginRequired: true, message: "Bitte melde dich an, um Inhalte zu löschen." };
  if (!can(access, permission)) return { ok: false, message: "Du hast keine Berechtigung für diese Löschung." };
  return null;
};

const invalidateContent = (communitySlug: string, postId?: string) => {
  revalidatePath("/");
  revalidatePath(`/c/${communitySlug}`);
  if (postId) revalidatePath(threadPath(communitySlug, postId));
  revalidatePath("/u/[nickname]", "page");
  refresh();
};

export const deleteCommunity = async (slug: string): Promise<DeleteResult> => {
  const denied = await authorize("deleteCommunities");
  if (denied) return denied;
  if (!validId(slug) || slug.length > 64) return { ok: false, message: "Die Community ist ungültig." };
  try {
    const removed = await getDatabase().transaction(async (tx) => {
      const [community] = await tx.select({ slug: communities.slug }).from(communities).where(eq(communities.slug, slug)).for("update").limit(1);
      if (!community) return false;
      const postIds = tx.select({ id: posts.id }).from(posts).where(eq(posts.communitySlug, slug));
      await tx.select({ id: posts.id }).from(posts).where(eq(posts.communitySlug, slug)).orderBy(asc(posts.id)).for("update");
      await tx.select({ id: comments.id }).from(comments).where(inArray(comments.postId, postIds)).orderBy(asc(comments.id)).for("update");
      await tx.delete(commentVotes).where(inArray(commentVotes.commentId, tx.select({ id: comments.id }).from(comments).where(inArray(comments.postId, postIds))));
      await tx.delete(comments).where(inArray(comments.postId, postIds));
      await tx.delete(postVotes).where(inArray(postVotes.postId, postIds));
      await tx.delete(posts).where(eq(posts.communitySlug, slug));
      await tx.delete(communityMemberships).where(eq(communityMemberships.communitySlug, slug));
      await tx.delete(communities).where(eq(communities.slug, slug));
      return true;
    });
    if (!removed) return { ok: false, message: "Diese Community wurde bereits entfernt oder nicht gefunden." };
    revalidatePath("/", "layout");
    refresh();
    return { ok: true, redirectTo: "/" };
  } catch {
    console.error("Community konnte nicht gelöscht werden.");
    return { ok: false, message: "Die Community konnte nicht gelöscht werden. Lade die Seite neu und versuche es erneut." };
  }
};

export const deletePost = async (postId: string): Promise<DeleteResult> => {
  const denied = await authorize("deletePosts");
  if (denied) return denied;
  if (!validId(postId)) return { ok: false, message: "Der Beitrag ist ungültig." };
  try {
    const removed = await getDatabase().transaction(async (tx) => {
      const [post] = await tx.select({ id: posts.id, communitySlug: posts.communitySlug }).from(posts).where(eq(posts.id, postId)).for("update").limit(1);
      if (!post) return null;
      await tx.select({ id: comments.id }).from(comments).where(eq(comments.postId, postId)).orderBy(asc(comments.id)).for("update");
      await tx.delete(commentVotes).where(inArray(commentVotes.commentId, tx.select({ id: comments.id }).from(comments).where(eq(comments.postId, postId))));
      await tx.delete(comments).where(eq(comments.postId, postId));
      await tx.delete(postVotes).where(eq(postVotes.postId, postId));
      await tx.delete(posts).where(eq(posts.id, postId));
      return post;
    });
    if (!removed) return { ok: false, message: "Dieser Beitrag wurde bereits entfernt oder nicht gefunden." };
    invalidateContent(removed.communitySlug, removed.id);
    return { ok: true, redirectTo: `/c/${removed.communitySlug}` };
  } catch {
    console.error("Beitrag konnte nicht gelöscht werden.");
    return { ok: false, message: "Der Beitrag konnte nicht gelöscht werden. Lade die Seite neu und versuche es erneut." };
  }
};

export const deleteComment = async (commentId: string): Promise<DeleteResult> => {
  const denied = await authorize("deleteComments");
  if (denied) return denied;
  if (!validId(commentId)) return { ok: false, message: "Der Kommentar ist ungültig." };
  try {
    const result = await getDatabase().transaction(async (tx) => {
      const [comment] = await tx.select({ id: comments.id, postId: comments.postId, deletedAt: comments.deletedAt })
        .from(comments).where(eq(comments.id, commentId)).for("update").limit(1);
      if (!comment) return { error: "Dieser Kommentar wurde bereits entfernt oder nicht gefunden." };
      if (comment.deletedAt) return { error: "Dieser Kommentar wurde bereits gelöscht." };
      const [post] = await tx.select({ communitySlug: posts.communitySlug }).from(posts).where(eq(posts.id, comment.postId)).limit(1);
      if (!post) return { error: "Der zugehörige Beitrag wurde bereits entfernt." };
      await tx.delete(commentVotes).where(eq(commentVotes.commentId, commentId));
      await tx.update(comments).set({ body: "", authorNickname: "", deletedAt: new Date() }).where(and(eq(comments.id, commentId), eq(comments.postId, comment.postId)));
      return { postId: comment.postId, communitySlug: post.communitySlug };
    });
    if (!result.postId || !result.communitySlug) return { ok: false, message: result.error ?? "Der Kommentar konnte nicht gelöscht werden." };
    invalidateContent(result.communitySlug, result.postId);
    return { ok: true };
  } catch {
    console.error("Kommentar konnte nicht gelöscht werden.");
    return { ok: false, message: "Der Kommentar konnte nicht gelöscht werden. Lade den aktuellen Stand und versuche es erneut." };
  }
};
