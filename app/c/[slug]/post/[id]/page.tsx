import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { CommentTree } from "@/components/comment-tree";
import { CommentForm } from "@/components/comment-form";
import { InfoPanel } from "@/components/info-panel";
import { PostCard } from "@/components/post-card";
import { communities } from "@/lib/communities";
import { getCurrentUser } from "@/lib/auth/session";
import { getComments, getPosts } from "@/lib/forum/queries";

type ThreadPageProps = { params: Promise<{ slug: string; id: string }> };

const ThreadContent = async ({ params }: ThreadPageProps) => {
  const { slug, id } = await params;
  const community = communities.find((item) => item.slug === slug);
  if (!community) notFound();
  const user = await getCurrentUser();
  const [post] = await getPosts(user?.id, { id, communitySlug: slug });
  if (!post) notFound();
  const postComments = await getComments(post.id, user?.id);

  return (
    <>
      <main id="main-content" className="main-column">
        <Link className="back-link" href={`/c/${slug}`}><HiOutlineArrowLeft aria-hidden="true" /> Zurück zu c/{slug}</Link>
        <PostCard post={{ ...post, commentCount: postComments.length }} viewerId={user?.id} detail />
        <section className="discussion" aria-labelledby="discussion-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Diskussion</p>
              <h2 id="discussion-title">Kommentare <span>{postComments.length}</span></h2>
            </div>
          </div>
          <CommentForm key={`${post.id}:${user?.id ?? "guest"}`} postId={post.id} canComment={Boolean(user)} />
          <CommentTree comments={postComments} viewerId={user?.id} />
        </section>
      </main>
      <aside className="right-column" aria-label="Zum Thread">
        <InfoPanel title={community.name} eyebrow="Community">
          <p>{community.description}</p>
          <Link className="text-link" href={`/c/${slug}`}>Community ansehen</Link>
        </InfoPanel>
        <InfoPanel title="Mitdiskutieren" eyebrow="Im Gespräch">
          <p>Angemeldet kannst du Beiträge und Kommentare bewerten, kommentieren und auf andere Antworten eingehen.</p>
        </InfoPanel>
      </aside>
    </>
  );
};

const ThreadPage = ({ params }: ThreadPageProps) => (
  <Suspense fallback={
    <main id="main-content" className="main-column">
      <div className="post-card post-detail" role="status">Thread wird geladen …</div>
    </main>
  }>
    <ThreadContent params={params} />
  </Suspense>
);

export default ThreadPage;
