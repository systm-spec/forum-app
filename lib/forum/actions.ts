"use server";

import { and, eq, sql } from "drizzle-orm";
import { refresh, revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { comments, commentVotes, posts, postVotes } from "@/lib/db/schema";
import { threadPath } from "@/lib/format";
import type { MutationResult, VoteTarget } from "./types";

const validId = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9][a-z0-9_-]{0,127}$/i.test(value);
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
      const [context] = target.type === "post"
        ? await tx.select({ id: posts.id, communitySlug: posts.communitySlug }).from(posts).where(eq(posts.id, target.id)).limit(1)
        : await tx.select({ id: posts.id, communitySlug: posts.communitySlug }).from(comments).innerJoin(posts, eq(comments.postId, posts.id)).where(eq(comments.id, target.id)).limit(1);
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
    || typeof input.submissionId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.submissionId)) {
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
