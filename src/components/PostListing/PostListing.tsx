import React from "react";
import { PostListingCarousel } from "./PostListingCarousel";
import { useDateFormatter } from "react-aria";
import type { CarouselImageData } from "../../types";

export interface PostListingData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  galleryImages?: CarouselImageData[];
}

export function PostListing({
  node,
  fullWidth,
}: {
  node: PostListingData;
  fullWidth?: boolean;
}) {
  const df = useDateFormatter({ timeZone: "utc" });
  return (
    <div className="">
      <div className="w-full prose mx-auto p-4 md:p-6">
        <div className="z-10 bg-white">
          {node.date && (
            <span className="block text-sm opacity-60">
              {df.format(new Date(node.date))}
            </span>
          )}
          <a
            className="underline text-blue-600 visited:text-purple-600 font-bold text-xl"
            href={`/posts${node.slug}`}
          >
            {node.title}
          </a>
          <p className="my-0 not-prose">{node.excerpt}</p>
        </div>
      </div>
      <PostListingCarousel
        fullWidth={fullWidth}
        galleryImages={node.galleryImages}
        playing
      />
    </div>
  );
}
