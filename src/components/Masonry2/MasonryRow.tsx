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
  // widthFn: (widthNumber: number) => string;
  width: number;
}

// const widthFn = (n) => `calc(calc(100vw - 200px) * ${n})`;

export function MasonryRow({
  items,
  row,
  targetAspect,
  // widthFn,
  width: rowWidth,
}: MasonryRowProps) {
  return (
    <>
      {items.map((node) => {
        const aspect = node.childImageSharp!.fluid!.aspectRatio;
        const widthNumber = aspect / (row.isWhole ? row.aspect : targetAspect);

        // wtf?? magic number??
        const width = (rowWidth * widthNumber) + "px";
        // const height = `calc(${width} / ${aspect})`;
        return (
          <Link
            className="inline-block relative p-1"
            key={node.id}
            style={{ width }}
            to={`/photos/${node.fields!.organization!.monthSlug}/${node.relativePath}`}
          >
            {/* eslint-disable-next-line */}
            <GatsbyImage
              // alt={node.id}
              className="h-full w-full"
              image={node.childImageSharp!.gatsbyImageData!}
              key={node.id}
              // alt={
              //   node.fields?.imageMeta?.meta?.Keywords?.length
              //     ? `image of ${image.fields?.imageMeta?.meta?.Keywords.join(
              //         " and ",
              //       )}. ${getName(image)}`
              //     : getName(image)
              // }
              // objectFit="cover"
              // objectPosition="center top"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0">
              <span className="bg-black/50 text-white">
                {/* {node.relativePath} */}
              </span>
            </div>
          </Link>
        );
      })}
    </>
  );
}
