import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommunityMembership } from "@/components/CommunityMembership";
import { DeleteControl } from "@/components/DeleteControl";
import { FeedFallback, SearchableFeed } from "@/components/Feed";
import { InfoPanel } from "@/components/UI/InfoPanel";
import { can, getCurrentAccess } from "@/lib/auth/access";
import { getCommunity, getCommunityPostCount, isCommunityMember } from "@/lib/forum/queries";

type CommunityPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

const CommunityStatistics = async ({ slug }: { slug: string }) => {
  const count = await getCommunityPostCount(slug);
  return <p className="mt-4 mb-0 border-t border-line pt-[14px] text-sm text-soft">{count} {count === 1 ? "Beitrag" : "Beiträge"}</p>;
};

const CommunityActions = async ({ slug }: { slug: string }) => {
  const access = await getCurrentAccess();
  const member = access ? await isCommunityMember(slug, access.userId) : false;
  return (
    <div className="mt-5 flex flex-wrap items-start gap-4">
      <Link className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 py-2 font-bold text-bg hover:bg-[#a6b2ff]" href={`/c/${slug}/new`}>Beitrag erstellen</Link>
      {access ? <CommunityMembership key={`${slug}:${access.userId}:${member}`} slug={slug} initialMember={member} /> : <p className="m-0 self-center text-sm text-muted"><Link className="font-semibold text-accent underline" href="/login">Einloggen</Link>, um beizutreten oder einen Beitrag zu erstellen.</p>}
      {can(access, "deleteCommunities") && <DeleteControl target={{ type: "community", id: slug }} />}
    </div>
  );
};

const CommunityContent = async ({ params, searchParams }: CommunityPageProps) => {
  const { slug } = await params;
  const community = await getCommunity(slug);
  if (!community) notFound();

  return (
    <>
      <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
        <div className="relative mb-7 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(120deg,#292e3b,#222732_70%)] px-[30px] pt-7 pb-[30px] before:absolute before:top-0 before:left-[30px] before:h-[2px] before:w-12 before:bg-accent before:content-[''] max-[700px]:mb-6 max-[700px]:px-5 max-[700px]:py-[23px] max-[700px]:before:left-5">
          <p className="mb-[7px] text-xs font-bold tracking-[.09em] text-accent uppercase">Community</p>
          <h1 className="mb-[5px] text-[clamp(31px,4vw,42px)] leading-[1.1] tracking-[-.04em] [overflow-wrap:anywhere]">{community.name}</h1>
          <p className="mb-0 max-w-[56ch] text-muted">{community.description}</p>
          <span className="mt-[18px] inline-block rounded-md border border-[#56618a] px-[9px] py-1 text-[13px] font-semibold text-accent">c/{community.slug}</span>
          <Suspense fallback={<p className="mt-5 text-sm text-muted" role="status">Aktionen werden geladen …</p>}><CommunityActions slug={slug} /></Suspense>
        </div>
        <Suspense fallback={<FeedFallback />}>
          <SearchableFeed communitySlug={slug} searchParams={searchParams} />
        </Suspense>
      </main>
      <aside className="sticky top-[110px] grid min-w-0 gap-4 max-[1100px]:static max-[1100px]:col-start-2 max-[1100px]:row-start-2 max-[1100px]:grid-cols-2 max-[700px]:order-2 max-[700px]:w-full max-[700px]:grid-cols-1" aria-label={`Über ${community.name}`}>
        <InfoPanel title={`Über ${community.name}`} eyebrow="Themenraum">
          <p className="mb-0 text-sm text-muted">{community.description}</p>
          {community.topicBoundary && <div className="mt-4 border-t border-line pt-4"><h3 className="mb-1 text-sm font-semibold text-text">Themenabgrenzung</h3><p className="m-0 whitespace-pre-wrap text-sm text-muted [overflow-wrap:anywhere]">{community.topicBoundary}</p></div>}
          <Suspense fallback={<p className="mt-4 mb-0 border-t border-line pt-[14px] text-sm text-soft" role="status">Beiträge werden gezählt …</p>}><CommunityStatistics slug={slug} /></Suspense>
        </InfoPanel>
        <InfoPanel title="Im Umgang miteinander" eyebrow="Leitlinien">
          <ol className="m-0 grid gap-[9px] pl-[19px] text-sm text-muted">
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
    <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
      <div className="relative mb-7 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(120deg,#292e3b,#222732_70%)] px-[30px] pt-7 pb-[30px] before:absolute before:top-0 before:left-[30px] before:h-[2px] before:w-12 before:bg-accent before:content-[''] max-[700px]:mb-6 max-[700px]:px-5 max-[700px]:py-[23px] max-[700px]:before:left-5">
        <p className="mb-[7px] text-xs font-bold tracking-[.09em] text-accent uppercase">Community</p>
        <h1 className="mb-[5px] text-[clamp(31px,4vw,42px)] leading-[1.1] tracking-[-.04em] [overflow-wrap:anywhere]">Community wird geladen</h1>
      </div>
      <FeedFallback />
    </main>
  }>
    <CommunityContent params={params} searchParams={searchParams} />
  </Suspense>
);

export default CommunityPage;
