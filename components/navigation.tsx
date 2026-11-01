import { Suspense } from "react";
import { ActiveNavigationLinks, NavigationLinks } from "./NavigationLinks";

export const Navigation = () => (
  <aside className="left-column" aria-label="Seitennavigation">
    <nav aria-label="Hauptnavigation">
      <Suspense fallback={<NavigationLinks />}>
        <ActiveNavigationLinks />
      </Suspense>
    </nav>
    <div className="nav-footer">Ein Platz für gute Gespräche.</div>
  </aside>
);
