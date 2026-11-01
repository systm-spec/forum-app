"use server";

import { and, eq, sql } from "drizzle-orm";
import { refresh, revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { comments, commentVotes, communities, communityMemberships, posts, postVotes } from "@/lib/db/schema";
import { threadPath } from "@/lib/format";
import type { MutationResult, PostKind, VoteTarget } from "./types";

const validId = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9][a-z0-9_-]{0,127}$/i.test(value);
const validSubmissionId = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const invalidateForum = (post: { id: string; communitySlug: string }) => {
  revalidatePath("/");
  revalidatePath(`/c/${post.communitySlug}`);
  revalidatePath(threadPath(post.communitySlug, post.id));
  revalidatePath("/u/[nickname]", "page");
  refresh();
};

export const toggleVote = async (target: VoteTarget, direction: -1 | 1): Promise<MutationResult> => {
  const user = await getCurrentUser();
  if (!user) return { ok: false, loginRequired: true, message: "Bitte melde dich zum Abstimmen an." };
  if (!target || (target.type !== "post" && target.type !== "comment") || !validId(target.id) || (direction !== 1 && direction !== -1)) {
    return { ok: false, message: "Die Abstimmung ist ungültig." };
  }

  try {
    const post = await getDatabase().transaction(async (tx) => {
      // Sperrt auch den Fall ohne vorhandene Stimme, über alle Serverprozesse hinweg.
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`${user.id}:${target.type}:${target.id}`}, 0))`);
      const [comment] = target.type === "comment"
        ? await tx.select({ postId: comments.postId, deletedAt: comments.deletedAt }).from(comments).where(eq(comments.id, target.id)).for("update").limit(1)
        : [];
      if (target.type === "comment" && (!comment || comment.deletedAt)) return null;
      const [context] = await tx.select({ id: posts.id, communitySlug: posts.communitySlug }).from(posts)
        .where(eq(posts.id, target.type === "post" ? target.id : comment!.postId)).limit(1);
      if (!context) return null;

      if (target.type === "post") {
        const condition = and(eq(postVotes.userId, user.id), eq(postVotes.postId, target.id));
        const [current] = await tx.select({ value: postVotes.value }).from(postVotes).where(condition);
        if (current?.value === direction) await tx.delete(postVotes).where(condition);
        else await tx.insert(postVotes).values({ userId: user.id, postId: target.id, value: direction })
          .onConflictDoUpdate({ target: [postVotes.userId, postVotes.postId], set: { value: direction } });
      } else {
        const condition = and(eq(commentVotes.userId, user.id), eq(commentVotes.commentId, target.id));
        const [current] = await tx.select({ value: commentVotes.value }).from(commentVotes).where(condition);
        if (current?.value === direction) await tx.delete(commentVotes).where(condition);
        else await tx.insert(commentVotes).values({ userId: user.id, commentId: target.id, value: direction })
          .onConflictDoUpdate({ target: [commentVotes.userId, commentVotes.commentId], set: { value: direction } });
      }
      return context;
    });
    if (!post) return { ok: false, message: "Der Beitrag oder Kommentar wurde nicht gefunden." };
    invalidateForum(post);
    return { ok: true };
  } catch {
    console.error("Stimmabgabe fehlgeschlagen.");
    return { ok: false, message: "Die Stimme konnte nicht bestätigt werden. Lade den aktuellen Stand, bevor du erneut abstimmst." };
  }
};

type CommentInput = { postId: string; parentId: string | null; body: string; submissionId: string };

export const createComment = async (input: CommentInput): Promise<MutationResult> => {
  const user = await getCurrentUser();
  if (!user) return { ok: false, loginRequired: true, message: "Bitte melde dich zum Kommentieren an." };
  if (!input || !validId(input.postId) || (input.parentId !== null && !validId(input.parentId)) || typeof input.body !== "string"
    || !validSubmissionId(input.submissionId)) {
    return { ok: false, message: "Der Kommentar konnte nicht zugeordnet werden." };
  }
  const body = input.body.trim();
  if (!body || [...body].length > 10000) return { ok: false, message: "Ein Kommentar muss 1–10.000 Zeichen enthalten." };

  try {
    const result = await getDatabase().transaction(async (tx) => {
      const [post] = await tx.select({ id: posts.id, communitySlug: posts.communitySlug }).from(posts).where(eq(posts.id, input.postId)).limit(1);
      if (!post) return { error: "Der Beitrag wurde nicht gefunden." };
      if (input.parentId) {
        const [parent] = await tx.select({ postId: comments.postId }).from(comments).where(eq(comments.id, input.parentId)).limit(1);
        if (!parent || parent.postId !== input.postId) return { error: "Die Antwort gehört nicht zu diesem Beitrag." };
      }

      await tx.insert(comments).values({
        postId: input.postId, parentId: input.parentId, authorId: user.id, authorNickname: user.nickname, body, submissionId: input.submissionId,
      }).onConflictDoNothing({ target: [comments.authorId, comments.submissionId] });

      // Derselbe Übermittlungsschlüssel darf nur genau diesen Kommentar bestätigen.
      const [saved] = await tx.select({ postId: comments.postId, parentId: comments.parentId, body: comments.body }).from(comments)
        .where(and(eq(comments.authorId, user.id), eq(comments.submissionId, input.submissionId))).limit(1);
      if (!saved || saved.postId !== input.postId || saved.parentId !== input.parentId || saved.body !== body) {
        return { error: "Diese Übermittlung wurde bereits für einen anderen Kommentar verwendet." };
      }
      return { post };
    });
    if (!result.post) return { ok: false, message: result.error ?? "Der Kommentar konnte nicht gespeichert werden." };
    invalidateForum(result.post);
    return { ok: true };
  } catch {
    console.error("Kommentar konnte nicht gespeichert werden.");
    return { ok: false, message: "Der Kommentar konnte nicht bestätigt werden. Dein Text bleibt erhalten; du kannst dieselbe Übermittlung erneut versuchen." };
  }
};

type PostInput = { communitySlug: string; kind: PostKind; title: string; body: string; submissionId: string };
type PostResult = { ok: true; postId: string } | { ok: false; message: string; loginRequired?: boolean };

export const createPost = async (input: PostInput): Promise<PostResult> => {
  const user = await getCurrentUser();
  if (!user) return { ok: false, loginRequired: true, message: "Bitte melde dich an, um einen Beitrag zu erstellen." };
  if (!input || typeof input.communitySlug !== "string" || !validSubmissionId(input.submissionId)
    || !["question", "thesis", "solution"].includes(input.kind)
    || typeof input.title !== "string" || typeof input.body !== "string") {
    return { ok: false, message: "Die Beitragsdaten sind ungültig." };
  }
  const title = input.title.trim();
  const body = input.body.trim();
  if (!title || [...title].length > 300) return { ok: false, message: "Der Titel muss 1–300 Zeichen enthalten." };
  if (!body || [...body].length > 10000) return { ok: false, message: "Der Inhalt muss 1–10.000 Zeichen enthalten." };

  try {
    const result = await getDatabase().transaction(async (tx) => {
      const [community] = await tx.select({ slug: communities.slug }).from(communities)
        .where(eq(communities.slug, input.communitySlug)).limit(1);
      if (!community) return { error: "Diese Community wurde nicht gefunden." };

      await tx.insert(posts).values({
        id: crypto.randomUUID(), communitySlug: community.slug, authorId: user.id, authorNickname: user.nickname,
        kind: input.kind, title, body, submissionId: input.submissionId,
      }).onConflictDoNothing({ target: [posts.authorId, posts.submissionId] });

      const [saved] = await tx.select({ id: posts.id, communitySlug: posts.communitySlug, kind: posts.kind, title: posts.title, body: posts.body })
        .from(posts).where(and(eq(posts.authorId, user.id), eq(posts.submissionId, input.submissionId))).limit(1);
      if (!saved || saved.communitySlug !== input.communitySlug || saved.kind !== input.kind || saved.title !== title || saved.body !== body) {
        return { error: "Diese Übermittlung wurde bereits für einen anderen Beitrag verwendet." };
      }
      return { postId: saved.id };
    });
    if (!result.postId) return { ok: false, message: result.error ?? "Der Beitrag konnte nicht gespeichert werden." };
    invalidateForum({ id: result.postId, communitySlug: input.communitySlug });
    return { ok: true, postId: result.postId };
  } catch {
    console.error("Beitrag konnte nicht gespeichert werden.");
    return { ok: false, message: "Der Beitrag konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten; versuche dieselbe Übermittlung erneut." };
  }
};

const changeMembership = async (communitySlug: string, join: boolean): Promise<MutationResult> => {
  const user = await getCurrentUser();
  if (!user) return { ok: false, loginRequired: true, message: "Bitte melde dich an, um einer Community beizutreten." };
  if (typeof communitySlug !== "string" || !validId(communitySlug) || communitySlug.length > 64) {
    return { ok: false, message: "Die Community ist ungültig." };
  }
  try {
    const [community] = await getDatabase().select({ slug: communities.slug }).from(communities)
      .where(eq(communities.slug, communitySlug)).limit(1);
    if (!community) return { ok: false, message: "Diese Community wurde nicht gefunden." };
    if (join) {
      await getDatabase().insert(communityMemberships).values({ userId: user.id, communitySlug }).onConflictDoNothing();
    } else {
      await getDatabase().delete(communityMemberships).where(and(eq(communityMemberships.userId, user.id), eq(communityMemberships.communitySlug, communitySlug)));
    }
    revalidatePath(`/c/${communitySlug}`);
    refresh();
    return { ok: true };
  } catch {
    console.error("Community-Mitgliedschaft konnte nicht geändert werden.");
    return { ok: false, message: "Dein Beitrittsstatus konnte nicht bestätigt werden. Lade die Seite neu, bevor du es erneut versuchst." };
  }
};

export const joinCommunity = async (communitySlug: string): Promise<MutationResult> => changeMembership(communitySlug, true);
export const leaveCommunity = async (communitySlug: string): Promise<MutationResult> => changeMembership(communitySlug, false);
