import { Suspense } from "react";
import { getCurrentAccess } from "@/lib/auth/access";
import { getCommunities } from "@/lib/forum/queries";
import { ActiveNavigationLinks, NavigationLinks } from "./NavigationLinks";

const CommunityNavigation = async () => {
  const [communities, access] = await Promise.all([getCommunities(), getCurrentAccess()]);
  return <ActiveNavigationLinks communities={communities} isAdmin={access?.role === "admin"} />;
};

export const Navigation = () => (
  <aside className="sticky top-[110px] min-w-0 py-[7px] max-[700px]:static max-[700px]:order-0 max-[700px]:w-full max-[700px]:overflow-hidden max-[700px]:p-0" aria-label="Seitennavigation">
    <nav className="flex flex-col gap-[3px] max-[700px]:flex-row max-[700px]:gap-[7px] max-[700px]:overflow-x-auto max-[700px]:pb-1 max-[700px]:[scrollbar-width:thin]" aria-label="Hauptnavigation">
      <Suspense fallback={<NavigationLinks communities={[]} isAdmin={false} />}>
        <CommunityNavigation />
      </Suspense>
    </nav>
    <div className="mx-3 mt-9 border-t border-line pt-[17px] text-[13px] text-soft max-[700px]:hidden">Ein Platz für gute Gespräche.</div>
  </aside>
);
