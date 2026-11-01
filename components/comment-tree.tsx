import { HiOutlineArrowUp } from "react-icons/hi2";
import type { Comment } from "@/lib/demo-data";

type CommentTreeProps = { comments: Comment[] };
type CommentNode = Comment & { replies: CommentNode[] };

const buildTree = (comments: Comment[]): CommentNode[] => {
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

const CommentItem = ({ comment }: { comment: CommentNode }) => (
  <li className="comment-item">
    <article className="comment">
      <div className="comment-meta"><strong>u/{comment.author}</strong><span>·</span><span>{comment.age}</span></div>
      <p>{comment.body}</p>
      <span className="comment-score" title="Abstimmungen sind noch nicht verfügbar" aria-label={`${comment.score} Stimmen; Abstimmungen noch nicht verfügbar`}>
        <HiOutlineArrowUp aria-hidden="true" /> {comment.score} Stimmen · Demo
      </span>
    </article>
    {comment.replies.length > 0 && <ul className="comment-replies">{comment.replies.map((reply) => <CommentItem key={reply.id} comment={reply} />)}</ul>}
  </li>
);

export const CommentTree = ({ comments }: CommentTreeProps) => {
  const tree = buildTree(comments);
  return tree.length ? <ul className="comment-list">{tree.map((comment) => <CommentItem key={comment.id} comment={comment} />)}</ul> : <p className="empty-state">Noch keine Kommentare.</p>;
};
