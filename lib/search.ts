import type { PostView } from "./forum/types";

export const readQuery = (value: string | string[] | undefined) =>
  (typeof value === "string" ? value : "").trim();

export const filterPosts = (posts: PostView[], query: string) => {
  const term = query.toLocaleLowerCase("de");
  return term
    ? posts.filter((post) => `${post.title} ${post.body} ${post.author}`.toLocaleLowerCase("de").includes(term))
    : posts;
};
