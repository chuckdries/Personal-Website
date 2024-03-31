import React from "react";
import { PhotoMonthNode } from "../photos/PhotoMonth";
import { Row } from "./MasonryContainer";
import { GatsbyImage } from "gatsby-plugin-image";

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
    <div className="w-screen relative my-2">
      {items.map((node) => {
        const aspect = node.childImageSharp!.fluid!.aspectRatio;
        const widthNumber =
          (aspect / (row.isWhole ? row.aspect : targetAspect)) * 100;

        const width = `${widthNumber}vw`;
        const height = `calc(${width} / ${aspect})`;
        console.log("🚀 height:", height);
        return (
          <div
            className="inline-block bg-red-500"
            key={node.id}
            style={{ width, height }}
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
              // className="w-full"
              // className="h-full w-full"
              image={node.childImageSharp!.gatsbyImageData!}
              objectFit="cover"
              objectPosition="center top"
            />
          </div>
        );
      })}
    </div>
  );
}
