import Link from "next/link";
import { formatTimestamp } from "@/lib/format";
import type { CommentView } from "@/lib/forum/types";
import { AuthorLink } from "./UI/AuthorLink";
import { CommentForm } from "./CommentForm";
import { VoteControls } from "./UI/VoteControls";
import { DeleteControl } from "./DeleteControl";

type CommentTreeProps = { comments: CommentView[]; viewerId?: string; canDelete?: boolean };
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

const CommentItem = ({ comment, depth, viewerId, canDelete }: { comment: CommentNode; depth: number; viewerId?: string; canDelete?: boolean }) => (
  <li className="min-w-0">
    <article id={`comment-${comment.id}`} className="min-w-0 scroll-mt-[94px] max-[700px]:scroll-mt-[86px]">
      {comment.deletedAt ? <p className="m-0 rounded-lg border border-dashed border-line bg-bg px-3 py-2 text-sm text-muted">Kommentar gelöscht.</p> : <><div className="flex flex-wrap items-center gap-[7px] text-[13px] text-soft [overflow-wrap:anywhere] [&>a:first-child]:font-bold [&>a:first-child]:text-text">
        <AuthorLink nickname={comment.author} authorId={comment.authorId} /><span aria-hidden="true">·</span>
        <time dateTime={comment.createdAt.toISOString()}>{formatTimestamp(comment.createdAt)}</time>
        {comment.parentId && <a className="text-[13px] text-muted hover:text-accent" href={`#comment-${comment.parentId}`}>Zur übergeordneten Antwort</a>}
      </div>
      <p className="mt-2 mb-2.5 whitespace-pre-wrap text-muted [overflow-wrap:anywhere]">{comment.body}</p>
      <div className="flex flex-wrap items-start gap-3">
        <VoteControls key={`${comment.id}:${viewerId ?? "guest"}`} target={{ type: "comment", id: comment.id }} score={comment.score} ownVote={comment.ownVote} canVote={Boolean(viewerId)} />
        {viewerId ? (
          <details className="min-w-0 flex-[1_1_180px] [&_form]:mt-2 [&_form]:mb-0 [&_form]:p-3"><summary className="w-fit cursor-pointer py-1.5 text-sm text-muted">Antworten</summary><CommentForm key={`${comment.id}:${viewerId}`} postId={comment.postId} parentId={comment.id} canComment /></details>
        ) : <Link className="text-[13px] text-muted hover:text-accent" href="/login">Zum Antworten einloggen</Link>}
      </div>
      {canDelete && <div className="mt-3"><DeleteControl target={{ type: "comment", id: comment.id }} /></div>}</>}
    </article>
    {comment.replies.length > 0 && (
      <ul className={`mt-[17px] grid list-none gap-[17px] ${depth >= 2 ? "pl-0 [&>li]:pl-0" : "border-l border-[#505a70] pl-[clamp(12px,3vw,24px)] [&>li]:pl-[clamp(8px,2vw,18px)] max-[700px]:pl-2 max-[700px]:[&>li]:pl-1.5"}`}>
        {comment.replies.map((reply) => <CommentItem key={reply.id} comment={reply} depth={depth + 1} viewerId={viewerId} canDelete={canDelete} />)}
      </ul>
    )}
  </li>
);

export const CommentTree = ({ comments, viewerId, canDelete }: CommentTreeProps) => {
  const tree = buildTree(comments);
  return tree.length
    ? <ul className="m-0 list-none rounded-2xl border border-line bg-surface p-0 [&>li]:px-[22px] [&>li]:py-5 [&>li+li]:border-t [&>li+li]:border-line max-[700px]:[&>li]:px-[15px] max-[700px]:[&>li]:py-[17px]">{tree.map((comment) => <CommentItem key={comment.id} comment={comment} depth={0} viewerId={viewerId} canDelete={canDelete} />)}</ul>
    : <p className="rounded-2xl border border-dashed border-line bg-surface px-[25px] py-[34px] text-muted">Noch keine Kommentare. Beginne das Gespräch.</p>;
};
