import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PostForm } from "@/components/PostForm";
import { InfoPanel } from "@/components/UI/InfoPanel";
import { getCurrentUser } from "@/lib/auth/session";
import { getCommunity } from "@/lib/forum/queries";

type NewPostPageProps = { params: Promise<{ slug: string }> };

const NewPostContent = async ({ params }: NewPostPageProps) => {
  const { slug } = await params;
  const community = await getCommunity(slug);
  if (!community) notFound();
  const user = await getCurrentUser();

  return (
    <>
      <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
        <Link className="mb-5 inline-block text-sm text-accent" href={`/c/${slug}`}>← Zurück zu {community.name}</Link>
        <h1 className="mb-2 text-[clamp(28px,4vw,38px)] leading-tight">Beitrag erstellen</h1>
        <p className="mb-6 text-muted">In {community.name} · c/{slug}</p>
        {user ? <PostForm communitySlug={slug} communityName={community.name} /> : <div className="rounded-2xl border border-line bg-surface p-6 text-muted"><p className="mb-3">Melde dich an, um einen Beitrag in {community.name} zu veröffentlichen.</p><Link className="font-semibold text-accent underline" href="/login">Einloggen</Link></div>}
      </main>
      <aside className="sticky top-[110px] min-w-0 max-[1100px]:static max-[1100px]:col-start-2 max-[1100px]:row-start-2 max-[700px]:order-2 max-[700px]:w-full" aria-label="Zur Community">
        <InfoPanel title={community.name} eyebrow="Community">
          <p className="m-0 text-sm text-muted">{community.description}</p>
          <p className="mt-4 mb-0 text-sm text-muted">Du kannst auch ohne Beitritt einen Beitrag schreiben. Ein Beitritt zeigt nur dein Interesse an der Community.</p>
        </InfoPanel>
      </aside>
    </>
  );
};

const NewPostPage = ({ params }: NewPostPageProps) => (
  <Suspense fallback={<main id="main-content" className="min-w-0 max-[700px]:order-1"><p className="rounded-2xl border border-line bg-surface p-6 text-muted" role="status">Formular wird geladen …</p></main>}>
    <NewPostContent params={params} />
  </Suspense>
);

export default NewPostPage;
