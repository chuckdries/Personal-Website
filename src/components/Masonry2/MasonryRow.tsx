import React from "react";
import { PhotoMonthNode } from "../photos/PhotoMonth";
import { MasonryImageRow } from "./MasonryContainer";
import { GatsbyImage } from "gatsby-plugin-image";
// import { Link } from "gatsby";
import { Link } from 'gatsby-plugin-modal-routing-3'
import { slice } from "ramda";
import { SiblingLocationState } from "../photos/PhotoImage/PhotoImage";

interface MasonryRowProps {
  // children: React.ReactNode;
  items: readonly PhotoMonthNode[];
  row: MasonryImageRow;
  targetAspect: number;
  // widthFn: (widthNumber: number) => string;
  width: number;
  nodes: string[];
}

// const widthFn = (n) => `calc(calc(100vw - 200px) * ${n})`;

export function MasonryRow({
  items,
  row,
  targetAspect,
  // widthFn,
  width: rowWidth,
  nodes,
}: MasonryRowProps) {
  return (
    <>
      {items.map((node, index) => {
        const aspect = node.childImageSharp!.fluid!.aspectRatio;
        const widthNumber = aspect / (row.isWhole ? row.aspect : targetAspect);

        // wtf?? magic number??
        const width = rowWidth * widthNumber + "px";
        // const height = `calc(${width} / ${aspect})`;

        const selfIndex = row.startIndex + index;
        return (
          <Link
            className="inline-block relative p-1"
            key={node.id}
            state={{
              selfIndex,
              context: nodes,
            } as SiblingLocationState}
            style={{ width }}
            asModal
            to={`/photos/${node.fields!.organization!.monthSlug}/${node.relativePath}`}
          >
            {/* eslint-disable-next-line */}
            <GatsbyImage
              alt={`photo called ${node.id}`}
              className="h-full w-full"
              image={node.childImageSharp!.gatsbyImageData!}
              key={node.id}
              // style={{
              //   "--img-src": node.childImageSharp?.gatsbyImageData.backgroundColor
              // }}
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
