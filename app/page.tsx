

import Link from "next/link";
import { Suspense } from "react";
import { FeedFallback, SearchableFeed } from "@/components/Feed";
import { InfoPanel } from "@/components/UI/InfoPanel";
import { getCommunities } from "@/lib/forum/queries";

const CommunityOverview = async () => {
  const communities = await getCommunities();
  return (
    <InfoPanel title="Communitys entdecken" eyebrow="Themenräume">
      <ul className="m-0 grid list-none gap-[13px] p-0">
        {communities.map((community) => (
          <li className="grid min-w-0 gap-px" key={community.id}>
            <Link className="text-sm font-semibold text-accent [overflow-wrap:anywhere]" href={`/c/${community.slug}`}>{community.name}</Link>
            <span className="text-[13px] text-soft">{community.shortDescription}</span>
          </li>
        ))}
      </ul>
      <Link className="mt-4 inline-block text-sm font-semibold text-accent" href="/communities/new">Community erstellen</Link>
    </InfoPanel>
  );
};

const HomePage = ({ searchParams }: PageProps<"/">) => (
    <>
      <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
        <div className="relative mb-7 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(120deg,#292e3b,#222732_70%)] px-[30px] pt-7 pb-[30px] before:absolute before:top-0 before:left-[30px] before:h-[2px] before:w-12 before:bg-accent before:content-[''] max-[700px]:mb-6 max-[700px]:px-5 max-[700px]:py-[23px] max-[700px]:before:left-5">
          <p className="mb-[7px] text-xs font-bold tracking-[.09em] text-accent uppercase">Dein Überblick</p>
          <h1 className="mb-[5px] text-[clamp(31px,4vw,42px)] leading-[1.1] tracking-[-.04em] [overflow-wrap:anywhere]">Im Gespräch</h1>
          <p className="mb-0 max-w-[56ch] text-muted">Gedanken, Fragen und Entdeckungen aus allen Communitys.</p>
        </div>
        <Suspense fallback={<FeedFallback />}>
          <SearchableFeed searchParams={searchParams} />
        </Suspense>
      </main>
      <aside className="sticky top-[110px] grid min-w-0 gap-4 max-[1100px]:static max-[1100px]:col-start-2 max-[1100px]:row-start-2 max-[1100px]:grid-cols-2 max-[700px]:order-2 max-[700px]:w-full max-[700px]:grid-cols-1" aria-label="Über das Forum">
        <InfoPanel title="Willkommen im Forum" eyebrow="Über diesen Ort">
          <p className="mb-0 text-sm text-muted">Ein ruhiger Platz für Fragen, Erfahrungen und Ideen. Entdecke die Communitys und teile deine Gedanken in den Diskussionen.</p>
        </InfoPanel>
        <Suspense fallback={<div className="rounded-2xl border border-line bg-surface p-[22px] text-sm text-muted" role="status">Communitys werden geladen …</div>}><CommunityOverview /></Suspense>
      </aside>
    </>
);

export default HomePage;
