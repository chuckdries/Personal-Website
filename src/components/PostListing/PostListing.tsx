import React, { useCallback, useState } from "react";
import { PostsNode } from "../../pages/posts";
import { PostListingCarousel } from "./PostListingCarousel";
import { Link } from "gatsby";
import { DateFormatter } from "react-aria";
import classNames from "classnames";
import { useMediaQuery } from "../../useMediaQuery";

export function PostListing({
  node,
  df,
}: {
  node: PostsNode;
  df: DateFormatter;
}) {
  const isTouch = useMediaQuery('(pointer: coarse)');
  const [isHover, setIsHover] = useState(false);
  const onMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);
  return (
    <div
      className=""
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full prose mx-auto p-4 md:p-6">
        <div className="z-10 bg-white">
          {node.frontmatter?.date && (
            <span className="block text-sm opacity-60">
              {df.format(new Date(node.frontmatter.date))}
            </span>
          )}
          <Link
            className="underline text-blue-600 visited:text-purple-600 font-bold text-xl"
            to={`/posts${node.frontmatter!.slug}`}
          >
            {node.frontmatter!.title}
          </Link>
          <p className="my-0 not-prose">{node.excerpt}</p>
        </div>
      </div>
      <PostListingCarousel
        galleryImages={node.frontmatter?.galleryImages}
        playing={isHover || isTouch}
        to={`/posts${node.frontmatter!.slug}`}
      />
    </div>
  );
}
