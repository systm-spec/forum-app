import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AuthorLink } from "@/components/author-link";
import { Feed, FeedFallback } from "@/components/feed";
import { InfoPanel } from "@/components/info-panel";
import { VoteControls } from "@/components/vote-controls";
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
      <main id="main-content" className="main-column">
        <div className="page-heading">
          <p className="eyebrow">Öffentliches Profil</p>
          <h1>u/{profile.nickname}</h1>
          <p>Registriert am <time dateTime={profile.createdAt.toISOString()}>{formatDate(profile.createdAt)}</time></p>
        </div>
        <Feed posts={posts} viewerId={viewer?.id} />
        <section className="profile-comments" aria-labelledby="profile-comments-title">
          <div className="section-heading"><h2 id="profile-comments-title">Kommentare <span>{comments.length}</span></h2></div>
          {comments.length ? (
            <div className="post-list">
              {comments.map((comment) => (
                <article key={comment.id} className="post-card comment-preview">
                  <div className="comment-meta">
                    <AuthorLink nickname={comment.author} authorId={comment.authorId} /><span aria-hidden="true">·</span>
                    <time dateTime={comment.createdAt.toISOString()}>{formatTimestamp(comment.createdAt)}</time>
                  </div>
                  <h3 className="post-title"><Link href={`${threadPath(comment.communitySlug, comment.postId)}#comment-${comment.id}`}>{comment.postTitle}</Link></h3>
                  <p className="post-body">{comment.body}</p>
                  <div className="post-actions">
                    <VoteControls key={`${comment.id}:${viewer?.id ?? "guest"}`} target={{ type: "comment", id: comment.id }} score={comment.score} ownVote={comment.ownVote} canVote={Boolean(viewer)} />
                    <Link className="text-link" href={`${threadPath(comment.communitySlug, comment.postId)}#comment-${comment.id}`}>Kommentar im Thread ansehen</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="empty-state">Noch keine Kommentare von u/{profile.nickname}.</p>}
        </section>
      </main>
      <aside className="right-column" aria-label="Zum Profil">
        <InfoPanel eyebrow="Aktivität" title={profile.nickname}>
          <p>{posts.length} {posts.length === 1 ? "Beitrag" : "Beiträge"} · {comments.length} {comments.length === 1 ? "Kommentar" : "Kommentare"}</p>
        </InfoPanel>
      </aside>
    </>
  );
};

const ProfilePage = ({ params }: ProfilePageProps) => (
  <Suspense fallback={
    <main id="main-content" className="main-column">
      <div className="page-heading"><p className="eyebrow">Öffentliches Profil</p><h1>Profil wird geladen</h1></div>
      <FeedFallback />
    </main>
  }><ProfileContent params={params} /></Suspense>
);

export default ProfilePage;
