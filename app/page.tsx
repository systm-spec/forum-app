

import Link from "next/link";
import { Suspense } from "react";
import { FeedFallback, SearchableFeed } from "@/components/Feed";
import { InfoPanel } from "@/components/InfoPanel";
import { communities } from "@/lib/communities";

const HomePage = ({ searchParams }: PageProps<"/">) => (
    <>
      <main id="main-content" className="main-column">
        <div className="page-heading">
          <p className="eyebrow">Dein Überblick</p>
          <h1>Im Gespräch</h1>
          <p>Gedanken, Fragen und Entdeckungen aus allen Communitys.</p>
        </div>
        <Suspense fallback={<FeedFallback />}>
          <SearchableFeed searchParams={searchParams} />
        </Suspense>
      </main>
      <aside className="right-column" aria-label="Über das Forum">
        <InfoPanel title="Willkommen im Forum" eyebrow="Über diesen Ort">
          <p>Ein ruhiger Platz für Fragen, Erfahrungen und Ideen. Entdecke die Communitys und teile deine Gedanken in den Diskussionen.</p>
        </InfoPanel>
        <InfoPanel title="Communitys entdecken" eyebrow="Themenräume">
          <ul className="info-list">
            {communities.map((community) => (
              <li key={community.slug}>
                <Link href={`/c/${community.slug}`}>c/{community.slug}</Link>
                <span>{community.shortDescription}</span>
              </li>
            ))}
          </ul>
        </InfoPanel>
      </aside>
    </>
);

export default HomePage;
