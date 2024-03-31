import React from "react";
import { PhotoMonthNode } from "../photos/PhotoMonth";
import { Row } from "./MasonryContainer";
import { GatsbyImage } from "gatsby-plugin-image";
import { Link } from "gatsby";

interface MasonryRowProps {
  // children: React.ReactNode;
  items: PhotoMonthNode[];
  row: Row;
  targetAspect: number;
}

export function MasonryRow({
  items,
  row,
  targetAspect,
  ...props
}: MasonryRowProps) {
  return (
    <div className="w-screen relative">
      {items.map((node) => {
        const aspect = node.childImageSharp!.fluid!.aspectRatio;
        const widthNumber =
          (aspect / (row.isWhole ? row.aspect : targetAspect)) * 100;

        const width = `${widthNumber}vw`;
        const height = `calc(${width} / ${aspect})`;
        return (
          <Link
            className="inline-block bg-red-500"
            key={node.id}
            style={{ width, height }}
            to={`/photos/${node.fields!.organization!.monthSlug}/${node.relativePath}`}
          >
            <GatsbyImage
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
          </Link>
        );
      })}
    </div>
  );
}
