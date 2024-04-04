import React from "react";
import { PhotoMonthNode } from "../photos/PhotoMonth";
import { MasonryImageRow } from "./MasonryContainer";
import { GatsbyImage } from "gatsby-plugin-image";
import { Link } from "gatsby";

interface MasonryRowProps {
  // children: React.ReactNode;
  items: readonly PhotoMonthNode[];
  row: MasonryImageRow;
  targetAspect: number;
  widthFn: (widthNumber: number) => string;
}

export function MasonryRow({
  items,
  row,
  targetAspect,
  widthFn,
}: MasonryRowProps) {
  return (
    <div className="relative">
      {items.map((node) => {
        const aspect = node.childImageSharp!.fluid!.aspectRatio;
        const widthNumber = aspect / (row.isWhole ? row.aspect : targetAspect);

        const width = widthFn(widthNumber);
        const height = `calc(${width} / ${aspect})`;
        return (
          <Link
            className="inline-block relative"
            key={node.id}
            style={{ width, height }}
            to={`/photos/${node.fields!.organization!.monthSlug}/${node.relativePath}`}
          >
            <GatsbyImage
              alt={node.id}
              key={node.id}
              // alt={
              //   node.fields?.imageMeta?.meta?.Keywords?.length
              //     ? `image of ${image.fields?.imageMeta?.meta?.Keywords.join(
              //         " and ",
              //       )}. ${getName(image)}`
              //     : getName(image)
              // }
              className="h-full w-full"
              image={node.childImageSharp!.gatsbyImageData!}
              // objectFit="cover"
              // objectPosition="center top"
            />
            {/* <div className="absolute top-0 left-0 right-0 bottom-0">
              <span className="bg-black/50 text-white">
                {node.relativePath}
              </span>
            </div> */}
          </Link>
        );
      })}
    </div>
  );
}
