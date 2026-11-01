import { getCurrentUser } from "@/lib/auth/session";
import { getPosts } from "@/lib/forum/queries";
import type { PostView } from "@/lib/forum/types";
import { filterPosts, readQuery } from "@/lib/search";
import { PostCard } from "./post-card";

type SearchableFeedProps = { communitySlug?: string; searchParams: Promise<{ q?: string | string[] }> };
type FeedProps = { posts: PostView[]; query?: string; viewerId?: string };

export const SearchableFeed = async ({ communitySlug, searchParams }: SearchableFeedProps) => {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);
  const posts = await getPosts(user?.id, { communitySlug });
  return <Feed posts={posts} query={readQuery(params.q)} viewerId={user?.id} />;
};

export const FeedFallback = () => (
  <section className="feed" aria-label="Beiträge werden geladen">
    <div className="section-heading feed-heading"><div><p className="eyebrow">Beiträge</p><h2>Aktuelle Beiträge</h2></div></div>
    <div className="empty-state" role="status">Beiträge werden geladen …</div>
  </section>
);

export const Feed = ({ posts, query = "", viewerId }: FeedProps) => {
  const visiblePosts = filterPosts(posts, query);
  return (
    <section className="feed" aria-labelledby="feed-title">
      <div className="section-heading feed-heading">
        <div><p className="eyebrow">Beiträge</p><h2 id="feed-title">{query ? `Suche: „${query}“` : "Aktuelle Beiträge"}</h2></div>
        <span className="section-caption">{visiblePosts.length} {visiblePosts.length === 1 ? "Beitrag" : "Beiträge"}</span>
      </div>
      {visiblePosts.length ? (
        <div className="post-list">{visiblePosts.map((post) => <PostCard key={post.id} post={post} viewerId={viewerId} />)}</div>
      ) : (
        <div className="empty-state"><h3>{query ? "Keine Beiträge gefunden" : "Noch keine Beiträge"}</h3><p>{query ? "Versuche einen anderen Suchbegriff." : "Hier wurden noch keine Beiträge veröffentlicht."}</p></div>
      )}
    </section>
  );
};
