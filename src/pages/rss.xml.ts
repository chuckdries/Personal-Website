import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");

  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return rss({
    title: "Chuck Dries Posts",
    description: "Blog posts by Chuck Dries",
    site: context.site!.toString(),
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      link: `/posts${post.data.slug}`,
    })),
  });
}
