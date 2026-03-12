import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { photoLoader } from "./loaders/photos";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./data/posts" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    bskyPost: z.string().optional(),
    cover: z.string().optional(),
    galleryImages: z.array(z.string()).optional(),
  }),
});

const photos = defineCollection({
  loader: photoLoader(),
  schema: z.object({
    filename: z.string(),
    relativePath: z.string(),
    width: z.number(),
    height: z.number(),
    aspectRatio: z.number(),
    dominantColor: z.string(),
    dateTaken: z.string(),
    datePublished: z.string(),
    slug: z.string(),
    organization: z.object({
      year: z.number(),
      month: z.number(),
      yearFolder: z.string(),
      monthSlug: z.string(),
    }),
    meta: z.object({
      Make: z.string().nullable(),
      Model: z.string().nullable(),
      ExposureTime: z.number().nullable(),
      FNumber: z.number().nullable(),
      ISO: z.number().nullable(),
      DateTimeOriginal: z.string().nullable(),
      OffsetTimeOriginal: z.string().nullable(),
      FocalLength: z.number().nullable(),
      LensModel: z.string().nullable(),
      ObjectName: z.string().nullable(),
      Caption: z.string().nullable(),
      Rating: z.number().nullable(),
      Keywords: z.array(z.string()),
    }),
  }),
});

export const collections = { posts, photos };
