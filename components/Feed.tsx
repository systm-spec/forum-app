import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { getPosts } from "@/lib/forum/queries";
import type { PostView } from "@/lib/forum/types";
import { filterPosts, readQuery } from "@/lib/search";
import { PostCard } from "./UI/PostCard";

type SearchableFeedProps = { communitySlug?: string; searchParams: Promise<{ q?: string | string[] }> };
type FeedProps = { posts: PostView[]; query?: string; viewerId?: string; communitySlug?: string };

export const SearchableFeed = async ({ communitySlug, searchParams }: SearchableFeedProps) => {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  const posts = await getPosts(user?.id, { communitySlug });
  return <Feed posts={posts} query={readQuery(params.q)} viewerId={user?.id} communitySlug={communitySlug} />;
};

export const FeedFallback = () => (
  <section aria-label="Beiträge werden geladen">
    <div className="mb-4 flex items-end justify-between gap-4 max-[700px]:items-start"><div><p className="mb-0.5 text-xs font-bold tracking-[.09em] text-soft uppercase">Beiträge</p><h2 className="m-0 text-[23px] leading-[1.2] tracking-[-.025em] [overflow-wrap:anywhere]">Aktuelle Beiträge</h2></div></div>
    <div className="rounded-2xl border border-dashed border-line bg-surface px-[25px] py-[34px] text-muted" role="status">Beiträge werden geladen …</div>
  </section>
);

export const Feed = ({ posts, query = "", viewerId, communitySlug }: FeedProps) => {
  const visiblePosts = filterPosts(posts, query);
  return (
    <section aria-labelledby="feed-title">
      <div className="mb-4 flex items-end justify-between gap-4 max-[700px]:items-start">
        <div><p className="mb-0.5 text-xs font-bold tracking-[.09em] text-soft uppercase">Beiträge</p><h2 id="feed-title" className="m-0 text-[23px] leading-[1.2] tracking-[-.025em] [overflow-wrap:anywhere]">{query ? `Suche: „${query}“` : "Aktuelle Beiträge"}</h2></div>
        <span className="flex-none text-[13px] text-soft max-[390px]:text-xs">{visiblePosts.length} {visiblePosts.length === 1 ? "Beitrag" : "Beiträge"}</span>
      </div>
      {visiblePosts.length ? (
        <div className="grid gap-[14px]">{visiblePosts.map((post) => <PostCard key={post.id} post={post} viewerId={viewerId} />)}</div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface px-[25px] py-[34px] text-muted"><h3 className="mb-1 text-text">{query ? "Keine Beiträge gefunden" : "Noch keine Beiträge"}</h3><p className="m-0">{query ? "Versuche einen anderen Suchbegriff." : "Hier wurden noch keine Beiträge veröffentlicht."}</p>{communitySlug && !query && <Link className="mt-3 inline-block font-semibold text-accent" href={`/c/${communitySlug}/new`}>Ersten Beitrag erstellen</Link>}</div>
      )}
    </section>
  );
};
