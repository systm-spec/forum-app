import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AuthorLink } from "@/components/UI/AuthorLink";
import { Feed, FeedFallback } from "@/components/Feed";
import { InfoPanel } from "@/components/UI/InfoPanel";
import { VoteControls } from "@/components/UI/VoteControls";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDate, formatTimestamp, threadPath } from "@/lib/format";
import { getPosts, getProfileComments, getPublicProfile } from "@/lib/forum/queries";

type ProfilePageProps = { params: Promise<{ nickname: string }> };

const ProfileContent = async ({ params }: ProfilePageProps) => {
  const { nickname } = await params;
  const profile = await getPublicProfile(nickname);
  if (!profile) notFound();
  const viewer = await getCurrentUser();
  const [posts, comments] = await Promise.all([getPosts(viewer?.id, { authorId: profile.id }), getProfileComments(profile.id, viewer?.id)]);

  return (
    <>
      <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
        <div className="relative mb-7 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(120deg,#292e3b,#222732_70%)] px-[30px] pt-7 pb-[30px] before:absolute before:top-0 before:left-[30px] before:h-[2px] before:w-12 before:bg-accent before:content-[''] max-[700px]:mb-6 max-[700px]:px-5 max-[700px]:py-[23px] max-[700px]:before:left-5">
          <p className="mb-[7px] text-xs font-bold tracking-[.09em] text-accent uppercase">Öffentliches Profil</p>
          <h1 className="mb-[5px] text-[clamp(31px,4vw,42px)] leading-[1.1] tracking-[-.04em] [overflow-wrap:anywhere]">u/{profile.nickname}</h1>
          <p className="mb-0 max-w-[56ch] text-muted">Registriert am <time dateTime={profile.createdAt.toISOString()}>{formatDate(profile.createdAt)}</time></p>
        </div>
        <Feed posts={posts} viewerId={viewer?.id} />
        <section className="mt-8" aria-labelledby="profile-comments-title">
          <div className="mb-4 flex items-end justify-between gap-4 max-[700px]:items-start"><h2 id="profile-comments-title" className="m-0 text-[23px] leading-[1.2] tracking-[-.025em] [overflow-wrap:anywhere]">Kommentare <span className="text-base font-medium text-soft">{comments.length}</span></h2></div>
          {comments.length ? (
            <div className="grid gap-[14px]">
              {comments.map((comment) => (
                <article key={comment.id} className="min-w-0 rounded-2xl border border-line bg-surface px-[25px] pt-[22px] pb-5 hover:border-[#485267] max-[700px]:p-[18px]">
                  <div className="flex flex-wrap items-center gap-[7px] text-[13px] text-soft [overflow-wrap:anywhere] [&>a:first-child]:font-bold [&>a:first-child]:text-text">
                    <AuthorLink nickname={comment.author} authorId={comment.authorId} /><span aria-hidden="true">·</span>
                    <time dateTime={comment.createdAt.toISOString()}>{formatTimestamp(comment.createdAt)}</time>
                  </div>
                  <h3 className="mt-[13px] mb-2.5 text-lg leading-[1.27] tracking-[-.025em] [overflow-wrap:anywhere]"><Link className="hover:text-accent" href={`${threadPath(comment.communitySlug, comment.postId)}#comment-${comment.id}`}>{comment.postTitle}</Link></h3>
                  <p className="m-0 max-w-[68ch] whitespace-pre-wrap text-muted [overflow-wrap:anywhere]">{comment.body}</p>
                  <div className="mt-5 flex flex-wrap gap-[9px]">
                    <VoteControls key={`${comment.id}:${viewer?.id ?? "guest"}`} target={{ type: "comment", id: comment.id }} score={comment.score} ownVote={comment.ownVote} canVote={Boolean(viewer)} />
                    <Link className="mt-[5px] inline-block text-sm font-semibold text-accent [overflow-wrap:anywhere]" href={`${threadPath(comment.communitySlug, comment.postId)}#comment-${comment.id}`}>Kommentar im Thread ansehen</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="rounded-2xl border border-dashed border-line bg-surface px-[25px] py-[34px] text-muted">Noch keine Kommentare von u/{profile.nickname}.</p>}
        </section>
      </main>
      <aside className="sticky top-[110px] grid min-w-0 gap-4 max-[1100px]:static max-[1100px]:col-start-2 max-[1100px]:row-start-2 max-[1100px]:grid-cols-2 max-[700px]:order-2 max-[700px]:w-full max-[700px]:grid-cols-1" aria-label="Zum Profil">
        <InfoPanel eyebrow="Aktivität" title={profile.nickname}>
          <p className="mb-0 text-sm text-muted">{posts.length} {posts.length === 1 ? "Beitrag" : "Beiträge"} · {comments.length} {comments.length === 1 ? "Kommentar" : "Kommentare"}</p>
        </InfoPanel>
      </aside>
    </>
  );
};

const ProfilePage = ({ params }: ProfilePageProps) => (
  <Suspense fallback={
    <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
      <div className="relative mb-7 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(120deg,#292e3b,#222732_70%)] px-[30px] pt-7 pb-[30px] before:absolute before:top-0 before:left-[30px] before:h-[2px] before:w-12 before:bg-accent before:content-[''] max-[700px]:mb-6 max-[700px]:px-5 max-[700px]:py-[23px] max-[700px]:before:left-5"><p className="mb-[7px] text-xs font-bold tracking-[.09em] text-accent uppercase">Öffentliches Profil</p><h1 className="mb-[5px] text-[clamp(31px,4vw,42px)] leading-[1.1] tracking-[-.04em] [overflow-wrap:anywhere]">Profil wird geladen</h1></div>
      <FeedFallback />
    </main>
  }><ProfileContent params={params} /></Suspense>
);

export default ProfilePage;
