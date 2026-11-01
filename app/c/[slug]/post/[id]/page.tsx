import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { CommentTree } from "@/components/comment-tree";
import { InfoPanel } from "@/components/info-panel";
import { PostCard } from "@/components/post-card";
import { comments, communities, posts } from "@/lib/demo-data";

type ThreadPageProps = { params: Promise<{ slug: string; id: string }> };

const ThreadContent = async ({ params }: ThreadPageProps) => {
  const { slug, id } = await params;
  const community = communities.find((item) => item.slug === slug);
  const post = posts.find((item) => item.id === id && item.communitySlug === slug);
  if (!community || !post) notFound();

  const postComments = comments.filter((comment) => comment.postId === post.id);

  return (
    <>
      <main id="main-content" className="main-column">
        <Link className="back-link" href={`/c/${slug}`}><HiOutlineArrowLeft aria-hidden="true" /> Zurück zu c/{slug}</Link>
        <PostCard post={post} community={community} detail />
        <section className="discussion" aria-labelledby="discussion-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Diskussion</p>
              <h2 id="discussion-title">Kommentare <span>{postComments.length}</span></h2>
            </div>
            <span className="section-caption">Antworten folgen später</span>
          </div>
          <CommentTree comments={postComments} />
        </section>
      </main>
      <aside className="right-column" aria-label="Zum Thread">
        <InfoPanel title={community.name} eyebrow="Community">
          <p>{community.description}</p>
          <Link className="text-link" href={`/c/${slug}`}>Community ansehen</Link>
        </InfoPanel>
        <InfoPanel title="Mitdiskutieren" eyebrow="Demnächst">
          <p>Anmeldung, Abstimmungen und eigene Antworten werden in einem späteren Schritt ergänzt.</p>
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
