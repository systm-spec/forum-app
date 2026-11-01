

import Link from "next/link";
import { Feed } from "@/components/feed";
import { InfoPanel } from "@/components/info-panel";
import { communities, posts } from "@/lib/demo-data";
import { readQuery } from "@/lib/search";

const HomePage = async ({ searchParams }: PageProps<"/">) => {
  const query = readQuery((await searchParams).q);

  return (
    <>
      <main id="main-content" className="main-column">
        <div className="page-heading">
          <p className="eyebrow">Dein Überblick</p>
          <h1>Im Gespräch</h1>
          <p>Gedanken, Fragen und Entdeckungen aus allen Communitys.</p>
        </div>
        <Feed posts={posts} communities={communities} query={query} />
      </main>
      <aside className="right-column" aria-label="Über das Forum">
        <InfoPanel title="Willkommen im Forum" eyebrow="Über diesen Ort">
          <p>Ein ruhiger Platz für Fragen, Erfahrungen und Ideen. Die Beiträge hier sind Beispieldaten für das erste UI-Grundgerüst.</p>
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
};

export default HomePage;
