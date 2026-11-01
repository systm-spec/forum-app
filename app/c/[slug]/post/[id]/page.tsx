import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { CommentTree } from "@/components/CommentTree";
import { CommentForm } from "@/components/CommentForm";
import { DeleteControl } from "@/components/DeleteControl";
import { InfoPanel } from "@/components/UI/InfoPanel";
import { PostCard } from "@/components/UI/PostCard";
import { can, getCurrentAccess } from "@/lib/auth/access";
import { getComments, getCommunity, getPosts } from "@/lib/forum/queries";

type ThreadPageProps = { params: Promise<{ slug: string; id: string }> };

const ThreadContent = async ({ params }: ThreadPageProps) => {
  const { slug, id } = await params;
  const community = await getCommunity(slug);
  if (!community) notFound();
  const access = await getCurrentAccess();
  const [post] = await getPosts(access?.userId, { id, communitySlug: slug });
  if (!post) notFound();
  const postComments = await getComments(post.id, access?.userId);

  return (
    <>
      <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
        <Link className="mt-[3px] mb-5 inline-flex items-center gap-2 text-sm text-muted hover:text-accent" href={`/c/${slug}`}><HiOutlineArrowLeft className="size-[17px]" aria-hidden="true" /> Zurück zu c/{slug}</Link>
        <PostCard post={{ ...post, commentCount: postComments.length }} viewerId={access?.userId} detail />
        {can(access, "deletePosts") && <div className="mt-3"><DeleteControl target={{ type: "post", id: post.id }} /></div>}
        <section className="mt-8" aria-labelledby="discussion-title">
          <div className="mb-4 flex items-end justify-between gap-4 max-[700px]:items-start">
            <div>
              <p className="mb-0.5 text-xs font-bold tracking-[.09em] text-soft uppercase">Diskussion</p>
              <h2 id="discussion-title" className="m-0 scroll-mt-[94px] text-[23px] leading-[1.2] tracking-[-.025em] [overflow-wrap:anywhere] max-[700px]:scroll-mt-[86px]">Kommentare <span className="text-base font-medium text-soft">{postComments.length}</span></h2>
            </div>
          </div>
          <CommentForm key={`${post.id}:${access?.userId ?? "guest"}`} postId={post.id} canComment={Boolean(access)} />
          <CommentTree comments={postComments} viewerId={access?.userId} canDelete={can(access, "deleteComments")} />
        </section>
      </main>
      <aside className="sticky top-[110px] grid min-w-0 gap-4 max-[1100px]:static max-[1100px]:col-start-2 max-[1100px]:row-start-2 max-[1100px]:grid-cols-2 max-[700px]:order-2 max-[700px]:w-full max-[700px]:grid-cols-1" aria-label="Zum Thread">
        <InfoPanel title={community.name} eyebrow="Community">
          <p className="mb-0 text-sm text-muted">{community.description}</p>
          <Link className="mt-[14px] inline-block text-sm font-semibold text-accent [overflow-wrap:anywhere]" href={`/c/${slug}`}>Community ansehen</Link>
        </InfoPanel>
        <InfoPanel title="Mitdiskutieren" eyebrow="Im Gespräch">
          <p className="mb-0 text-sm text-muted">Angemeldet kannst du Beiträge und Kommentare bewerten, kommentieren und auf andere Antworten eingehen.</p>
        </InfoPanel>
      </aside>
    </>
  );
};

const ThreadPage = ({ params }: ThreadPageProps) => (
  <Suspense fallback={
    <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
      <div className="min-w-0 rounded-2xl border border-line bg-surface px-[25px] pt-[22px] pb-5 max-[700px]:p-[18px]" role="status">Thread wird geladen …</div>
    </main>
  }>
    <ThreadContent params={params} />
  </Suspense>
);

export default ThreadPage;
