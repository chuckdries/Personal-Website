import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const photos = await getCollection("photos");
  const today = new Date();

  const sortedPhotos = photos
    .filter((p) => p.data.meta.Rating && p.data.meta.Rating >= 4)
    .sort(
      (a, b) =>
        new Date(b.data.dateTaken).getTime() -
        new Date(a.data.dateTaken).getTime(),
    );

  return rss({
    title: "Chuck Dries Photos",
    description: "Photos by Chuck Dries",
    site: context.site!.toString(),
    items: sortedPhotos.map((photo) => ({
      title:
        photo.data.meta.ObjectName ??
        photo.data.meta.Caption ??
        photo.data.filename,
      pubDate: new Date(photo.data.dateTaken),
      link: `/${photo.data.slug}`,
    })),
  });
}
