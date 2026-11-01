import type { Community, Post } from "@/lib/demo-data";
import { filterPosts } from "@/lib/search";
import { PostCard } from "./post-card";

type FeedProps = { posts: Post[]; communities: Community[]; query: string };

export const Feed = ({ posts, communities, query }: FeedProps) => {
  const visiblePosts = filterPosts(posts, query);

  return (
    <section className="feed" aria-labelledby="feed-title">
      <div className="section-heading feed-heading">
        <div>
          <p className="eyebrow">Beiträge</p>
          <h2 id="feed-title">{query ? `Suche: „${query}“` : "Aktuelle Beiträge"}</h2>
        </div>
        <span className="section-caption">{visiblePosts.length} {visiblePosts.length === 1 ? "Beitrag" : "Beiträge"}</span>
      </div>
      {visiblePosts.length ? (
        <div className="post-list">
          {visiblePosts.map((post) => {
            const community = communities.find((item) => item.slug === post.communitySlug);
            return community ? <PostCard key={post.id} post={post} community={community} /> : null;
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Keine Beiträge gefunden</h3>
          <p>Versuche einen anderen Suchbegriff.</p>
        </div>
      )}
    </section>
  );
};
