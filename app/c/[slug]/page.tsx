import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FeedFallback, SearchableFeed } from "@/components/feed";
import { InfoPanel } from "@/components/info-panel";
import { communities, posts } from "@/lib/demo-data";

type CommunityPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

const CommunityContent = async ({ params, searchParams }: CommunityPageProps) => {
  const { slug } = await params;
  const community = communities.find((item) => item.slug === slug);
  if (!community) notFound();

  const communityPosts = posts.filter((post) => post.communitySlug === slug);

  return (
    <>
      <main id="main-content" className="main-column">
        <div className="page-heading community-heading">
          <p className="eyebrow">Community</p>
          <h1>{community.name}</h1>
          <p>{community.description}</p>
          <span className="community-path">c/{community.slug}</span>
        </div>
        <Suspense fallback={<FeedFallback />}>
          <SearchableFeed posts={communityPosts} communities={communities} searchParams={searchParams} />
        </Suspense>
      </main>
      <aside className="right-column" aria-label={`Über ${community.name}`}>
        <InfoPanel title={`Über ${community.name}`} eyebrow="Themenraum">
          <p>{community.description}</p>
          <p className="muted-note">{communityPosts.length} Beiträge in dieser Demo</p>
        </InfoPanel>
        <InfoPanel title="Im Umgang miteinander" eyebrow="Leitlinien">
          <ol className="rules-list">
            <li>Bleib beim Thema und gib deinem Beitrag Kontext.</li>
            <li>Sei respektvoll, auch bei unterschiedlichen Meinungen.</li>
            <li>Teile Quellen, wenn du dich auf Fakten beziehst.</li>
          </ol>
        </InfoPanel>
      </aside>
    </>
  );
};

const CommunityPage = ({ params, searchParams }: CommunityPageProps) => (
  <Suspense fallback={
    <main id="main-content" className="main-column">
      <div className="page-heading community-heading">
        <p className="eyebrow">Community</p>
        <h1>Community wird geladen</h1>
      </div>
      <FeedFallback />
    </main>
  }>
    <CommunityContent params={params} searchParams={searchParams} />
  </Suspense>
);

export default CommunityPage;
