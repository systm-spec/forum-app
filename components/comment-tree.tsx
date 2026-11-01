import Link from "next/link";
import { formatTimestamp } from "@/lib/format";
import type { CommentView } from "@/lib/forum/types";
import { AuthorLink } from "./author-link";
import { CommentForm } from "./comment-form";
import { VoteControls } from "./vote-controls";

type CommentTreeProps = { comments: CommentView[]; viewerId?: string };
type CommentNode = CommentView & { replies: CommentNode[] };

const buildTree = (comments: CommentView[]) => {
  const nodes = new Map(comments.map((comment) => [comment.id, { ...comment, replies: [] as CommentNode[] }]));
  const roots: CommentNode[] = [];
  for (const comment of comments) {
    const node = nodes.get(comment.id)!;
    const parent = comment.parentId ? nodes.get(comment.parentId) : undefined;
    if (parent) parent.replies.push(node);
    else roots.push(node);
  }
  return roots;
};

const CommentItem = ({ comment, depth, viewerId }: { comment: CommentNode; depth: number; viewerId?: string }) => (
  <li className="comment-item">
    <article id={`comment-${comment.id}`} className="comment">
      <div className="comment-meta">
        <AuthorLink nickname={comment.author} authorId={comment.authorId} /><span aria-hidden="true">·</span>
        <time dateTime={comment.createdAt.toISOString()}>{formatTimestamp(comment.createdAt)}</time>
        {comment.parentId && <a className="parent-link" href={`#comment-${comment.parentId}`}>Zur übergeordneten Antwort</a>}
      </div>
      <p>{comment.body}</p>
      <div className="comment-actions">
        <VoteControls key={`${comment.id}:${viewerId ?? "guest"}`} target={{ type: "comment", id: comment.id }} score={comment.score} ownVote={comment.ownVote} canVote={Boolean(viewerId)} />
        {viewerId ? (
          <details className="reply-editor"><summary>Antworten</summary><CommentForm key={`${comment.id}:${viewerId}`} postId={comment.postId} parentId={comment.id} canComment /></details>
        ) : <Link className="reply-login" href="/login">Zum Antworten einloggen</Link>}
      </div>
    </article>
    {comment.replies.length > 0 && (
      <ul className={`comment-replies ${depth >= 2 ? "comment-replies-flat" : ""}`}>
        {comment.replies.map((reply) => <CommentItem key={reply.id} comment={reply} depth={depth + 1} viewerId={viewerId} />)}
      </ul>
    )}
  </li>
);

export const CommentTree = ({ comments, viewerId }: CommentTreeProps) => {
  const tree = buildTree(comments);
  return tree.length
    ? <ul className="comment-list">{tree.map((comment) => <CommentItem key={comment.id} comment={comment} depth={0} viewerId={viewerId} />)}</ul>
    : <p className="empty-state">Noch keine Kommentare. Beginne das Gespräch.</p>;
};
