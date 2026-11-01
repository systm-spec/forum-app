import Link from "next/link";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { formatTimestamp, threadPath } from "@/lib/format";
import type { PostView } from "@/lib/forum/types";
import { AuthorLink } from "./AuthorLink";
import { VoteControls } from "./VoteControls";

type PostCardProps = { post: PostView; detail?: boolean; viewerId?: string };

export const PostCard = ({ post, detail = false, viewerId }: PostCardProps) => {
  const href = threadPath(post.communitySlug, post.id);
  return (
    <article className={`post-card ${detail ? "post-detail" : ""}`}>
      <div className="post-meta">
        <Link href={`/c/${post.communitySlug}`} className="community-link">c/{post.communitySlug}</Link>
        <span aria-hidden="true">·</span><AuthorLink nickname={post.author} authorId={post.authorId} />
        <span aria-hidden="true">·</span><time dateTime={post.createdAt.toISOString()}>{formatTimestamp(post.createdAt)}</time>
      </div>
      {detail ? <h1 className="post-title">{post.title}</h1> : <h3 className="post-title"><Link href={href}>{post.title}</Link></h3>}
      <p className={`post-body ${detail ? "" : "post-excerpt"}`}>{post.body}</p>
      <div className="post-actions">
        <VoteControls key={`${post.id}:${viewerId ?? "guest"}`} target={{ type: "post", id: post.id }} score={post.score} ownVote={post.ownVote} canVote={Boolean(viewerId)} />
        <Link className="action-pill comment-link" href={`${href}#discussion-title`}><HiOutlineChatBubbleLeftRight aria-hidden="true" /> {post.commentCount} Kommentare</Link>
      </div>
    </article>
  );
};
