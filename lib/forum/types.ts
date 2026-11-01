export type VoteValue = -1 | 0 | 1;
export type VoteTarget = { type: "post" | "comment"; id: string };
export type MutationResult = { ok: true } | { ok: false; message: string; loginRequired?: boolean };
export type PostKind = "question" | "thesis" | "solution";

export type PostView = {
  id: string;
  communitySlug: string;
  authorId: string | null;
  author: string;
  kind: PostKind | null;
  title: string;
  body: string;
  createdAt: Date;
  score: number;
  ownVote: VoteValue;
  commentCount: number;
};

export type CommentView = {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string | null;
  author: string;
  deletedAt: Date | null;
  body: string;
  createdAt: Date;
  score: number;
  ownVote: VoteValue;
};
