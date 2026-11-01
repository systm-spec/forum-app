import Link from "next/link";
import { Suspense } from "react";
import { CommunityForm } from "@/components/CommunityForm";
import { InfoPanel } from "@/components/UI/InfoPanel";
import { getCurrentUser } from "@/lib/auth/session";

const NewCommunityContent = async () => {
  const user = await getCurrentUser();
  return (
    <>
      <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
        <h1 className="mb-2 text-[clamp(28px,4vw,38px)] leading-tight">Community erstellen</h1>
        <p className="mb-6 text-muted">Schaffe einen Raum für ein klar abgegrenztes Thema und unterschiedliche Perspektiven.</p>
        {user ? <CommunityForm /> : <div className="rounded-2xl border border-line bg-surface p-6 text-muted"><p className="mb-3">Melde dich an, um eine Community zu erstellen.</p><Link className="font-semibold text-accent underline" href="/login">Einloggen</Link></div>}
      </main>
      <aside className="sticky top-[110px] min-w-0 max-[1100px]:static max-[1100px]:col-start-2 max-[1100px]:row-start-2 max-[700px]:order-2 max-[700px]:w-full" aria-label="Zur Community-Erstellung">
        <InfoPanel title="Ein offener Themenraum" eyebrow="Community">
          <p className="m-0 text-sm text-muted">Ein Beitritt zeigt Interesse am Thema und bedeutet keine Zustimmung zu einer Position. Nach dem Erstellen bist du automatisch Mitglied.</p>
        </InfoPanel>
      </aside>
    </>
  );
};

const NewCommunityPage = () => (
  <Suspense fallback={<main id="main-content" className="min-w-0 max-[700px]:order-1"><p className="rounded-2xl border border-line bg-surface p-6 text-muted" role="status">Formular wird geladen …</p></main>}>
    <NewCommunityContent />
  </Suspense>
);

export default NewCommunityPage;
