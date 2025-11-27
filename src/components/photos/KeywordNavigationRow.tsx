import React, { useMemo } from "react";
import * as R from "ramda";
import { KeywordCard } from "./KeywordCard";

type PhotoNode = {
  id: string;
  fields?: {
    imageMeta?: {
      meta?: {
        Keywords?: readonly (string | null)[] | null;
      } | null;
    } | null;
  } | null;
  childImageSharp?: {
    gatsbyImageData?: any;
    fluid?: {
      aspectRatio?: number;
    } | null;
  } | null;
};

interface KeywordNavigationRowProps {
  allImages: readonly PhotoNode[];
  playing?: boolean;
}

// Same allowlist as in gatsby-node.ts
const KEYWORD_ALLOWLIST = new Set([
  "Film",
  "waterfall",
  "flowers",
  "sunset",
  "landscape",
]);

export function KeywordNavigationRow({
  allImages,
  playing = true,
}: KeywordNavigationRowProps) {
  // Group images by keyword
  const imagesByKeyword = useMemo(() => {
    const grouped: Record<string, PhotoNode[]> = {};

    allImages.forEach((image) => {
      const keywords = image.fields?.imageMeta?.meta?.Keywords;
      if (!keywords || !Array.isArray(keywords)) {
        return;
      }

      keywords.forEach((keyword) => {
        if (
          keyword &&
          typeof keyword === "string" &&
          KEYWORD_ALLOWLIST.has(keyword)
        ) {
          if (!grouped[keyword]) {
            grouped[keyword] = [];
          }
          grouped[keyword].push(image);
        }
      });
    });

    // Sort keywords and ensure we have images for each
    const sortedKeywords = Object.keys(grouped)
      .filter((keyword) => grouped[keyword].length > 0)
      .sort();

    return sortedKeywords.map((keyword) => ({
      keyword,
      images: grouped[keyword],
    }));
  }, [allImages]);

  if (imagesByKeyword.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-hidden overflow-y-visible px-0">
      <div className="w-full flex flex-nowrap gap-4 lg:gap-6 px-4 lg:px-6 py-6 overflow-y-visible overflow-x-auto justify-around">
        {imagesByKeyword.map(({ keyword, images }) => (
          <KeywordCard
            key={keyword}
            keyword={keyword}
            images={images}
            playing={playing}
          />
        ))}
      </div>
    </div>
  );
}

