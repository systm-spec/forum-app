import Link from "next/link";
import { HiOutlineArrowDown, HiOutlineArrowUp, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import type { Community, Post } from "@/lib/demo-data";

type PostCardProps = { post: Post; community: Community; detail?: boolean };

export const PostCard = ({ post, community, detail = false }: PostCardProps) => {
  const href = `/c/${community.slug}/post/${post.id}`;

  return (
    <article className={`post-card ${detail ? "post-detail" : ""}`}>
      <div className="post-meta">
        <Link href={`/c/${community.slug}`} className="community-link">c/{community.slug}</Link>
        <span aria-hidden="true">·</span>
        <span>u/{post.author}</span>
        <span aria-hidden="true">·</span>
        <span>{post.age}</span>
      </div>
      {detail ? <h1 className="post-title">{post.title}</h1> : <h3 className="post-title"><Link href={href}>{post.title}</Link></h3>}
      <p className={`post-body ${detail ? "" : "post-excerpt"}`}>{post.body}</p>
      <div className="post-actions">
        <span className="action-pill unavailable" title="Abstimmungen sind noch nicht verfügbar" aria-label={`${post.score} Stimmen; Abstimmungen noch nicht verfügbar`}>
          <HiOutlineArrowUp aria-hidden="true" /> <strong>{post.score}</strong> <HiOutlineArrowDown aria-hidden="true" /> <small>Demo</small>
        </span>
        {detail ? (
          <span className="action-pill"><HiOutlineChatBubbleLeftRight aria-hidden="true" /> {post.commentCount} Kommentare</span>
        ) : (
          <Link className="action-pill comment-link" href={href}><HiOutlineChatBubbleLeftRight aria-hidden="true" /> {post.commentCount} Kommentare</Link>
        )}
      </div>
    </article>
  );
};
