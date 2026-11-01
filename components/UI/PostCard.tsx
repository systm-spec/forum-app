import Link from "next/link";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { formatTimestamp, threadPath } from "@/lib/format";
import type { PostView } from "@/lib/forum/types";
import { postKindLabels } from "@/lib/forum/post-kind";
import { AuthorLink } from "./AuthorLink";
import { VoteControls } from "./VoteControls";

type PostCardProps = { post: PostView; detail?: boolean; viewerId?: string };

export const PostCard = ({ post, detail = false, viewerId }: PostCardProps) => {
  const href = threadPath(post.communitySlug, post.id);
  return (
    <article className={`min-w-0 rounded-2xl border border-line bg-surface px-[25px] pt-[22px] pb-5 max-[700px]:p-[18px] ${detail ? "hover:border-line" : "hover:border-[#485267]"}`}>
      <div className="flex flex-wrap items-center gap-[7px] text-[13px] text-soft [overflow-wrap:anywhere]">
        <Link href={`/c/${post.communitySlug}`} className="font-bold text-accent hover:text-accent">c/{post.communitySlug}</Link>
        {post.kind && <><span aria-hidden="true">·</span><span>{postKindLabels[post.kind]}</span></>}
        <span aria-hidden="true">·</span><AuthorLink nickname={post.author} authorId={post.authorId} />
        <span aria-hidden="true">·</span><time dateTime={post.createdAt.toISOString()}>{formatTimestamp(post.createdAt)}</time>
      </div>
      {detail ? <h1 className="mt-[13px] mb-2.5 text-[clamp(25px,3vw,34px)] leading-[1.27] tracking-[-.025em] [overflow-wrap:anywhere]">{post.title}</h1> : <h3 className="mt-[13px] mb-2.5 text-[22px] leading-[1.27] tracking-[-.025em] [overflow-wrap:anywhere] max-[700px]:text-xl"><Link className="hover:text-accent" href={href}>{post.title}</Link></h3>}
      <p className={`m-0 max-w-[68ch] whitespace-pre-wrap text-muted [overflow-wrap:anywhere] ${detail ? "" : "line-clamp-3"}`}>{post.body}</p>
      <div className="mt-5 flex flex-wrap gap-[9px]">
        <VoteControls key={`${post.id}:${viewerId ?? "guest"}`} target={{ type: "post", id: post.id }} score={post.score} ownVote={post.ownVote} canVote={Boolean(viewerId)} />
        <Link className="inline-flex min-h-8 items-center gap-[7px] rounded-lg border border-line px-2.5 py-[5px] text-[13px] text-muted hover:border-accent hover:text-accent" href={`${href}#discussion-title`}><HiOutlineChatBubbleLeftRight className="size-4" aria-hidden="true" /> {post.commentCount} Kommentare</Link>
      </div>
    </article>
  );
};
