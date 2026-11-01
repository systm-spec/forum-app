import type { Post } from "./demo-data";

export const readQuery = (value: string | string[] | undefined) =>
  (typeof value === "string" ? value : "").trim();

export const filterPosts = (posts: Post[], query: string) => {
  const term = query.toLocaleLowerCase("de");
  return term
    ? posts.filter((post) => `${post.title} ${post.body} ${post.author}`.toLocaleLowerCase("de").includes(term))
    : posts;
};
