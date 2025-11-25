import React, { ReactNode, useMemo } from "react";
import { Link } from "gatsby";
import Nav from "../Nav";
import { MasonryRow } from "../Masonry2/MasonryRow";
import { MasonryGroup, MasonryRowData } from "../Masonry2/MasonryContainer";
import { ListChildComponentProps } from "react-window";

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

interface PhotoMasonryRendererProps {
  row: MasonryRowData;
  props: ListChildComponentProps;
  targetAspect: number;
  width: number;
  groups: MasonryGroup[];
  allImages?: readonly PhotoNode[];
  keyword?: string;
}

// Same allowlist as in gatsby-node.ts
const KEYWORD_ALLOWLIST = new Set([
  "Film",
  "waterfall",
  "flowers",
  "sunset",
  "landscape",
]);

export function PhotoMasonryRenderer({
  row,
  props,
  targetAspect,
  width,
  groups,
  allImages,
  keyword,
}: PhotoMasonryRendererProps): ReactNode {
  // Extract keywords from allImages for pill navigation
  const keywords = useMemo(() => {
    if (!allImages) return [];
    
    const grouped: Record<string, boolean> = {};
    
    allImages.forEach((image) => {
      const imageKeywords = image.fields?.imageMeta?.meta?.Keywords;
      if (!imageKeywords || !Array.isArray(imageKeywords)) {
        return;
      }
      
      imageKeywords.forEach((kw) => {
        if (
          kw &&
          typeof kw === "string" &&
          KEYWORD_ALLOWLIST.has(kw)
        ) {
          grouped[kw] = true;
        }
      });
    });
    
    return Object.keys(grouped).sort();
  }, [allImages]);

  switch (row.type) {
    case "c":
      return (
        <div className="flex flex-col" style={props.style}>
          <Nav className="mb-4" scheme="light" />
          {keywords.length > 0 && (
            <div className="px-4 lg:px-8 py-3 flex flex-wrap gap-2.5">
              {keywords.map((kw) => (
                <Link
                  key={kw}
                  to={`/photos/${kw}`}
                  className="px-4 py-2 rounded-full bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-sm font-serif font-medium capitalize transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {kw}
                </Link>
              ))}
            </div>
          )}
          {keyword && (
            <div className="px-4 lg:px-8 py-3 flex items-center gap-4">
              <h2 className="text-2xl font-serif font-bold capitalize m-0">{keyword}</h2>
              <Link
                to="/photos"
                className="text-sm font-serif underline hover:no-underline text-gray-600 hover:text-gray-800 transition-colors"
              >
                View All Photos
              </Link>
            </div>
          )}
        </div>
      );
    case "l":
      return (
        <div className="relative" key={row.slug} style={props.style}>
          {row.slug === "Older" ? (
            <div className="p-4 lg:pl-8 flex flex-col justify-end h-full">
              <h2 className="text-3xl md:text-4xl m-0 md:m-1 font-bold">
                Older
              </h2>
            </div>
          ) : (
            <div className="p-4 lg:pl-8 flex justify-start items-end h-full">
              <h2 className="text-3xl md:text-4xl m-0 md:m-1">
                <span className="font-bold">{row.month}</span>{" "}
                <span className="font-extralight opacity-70">{row.year}</span>
              </h2>
            </div>
          )}
        </div>
      );
    case "i":
      return (
        <div
          className="relative flex"
          key={`${row.groupIndex}-${row.startIndex}`}
          style={props.style}
        >
          <MasonryRow
            items={groups[row.groupIndex].nodes.slice(
              row.startIndex,
              row.startIndex + row.images,
            )}
            nodes={groups[row.groupIndex].nodes.map(
              (n) => n.fields!.organization!.slug!,
            )}
            row={row}
            targetAspect={targetAspect}
            width={width - 10}
          />
        </div>
      );
  }
}

