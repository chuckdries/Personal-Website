import React from "react";
import { PhotoYearMonth } from "../PhotoYear";
import { GatsbyImage } from "gatsby-plugin-image";
import { Link } from "gatsby";

interface MonthTileProps {
  month: PhotoYearMonth;
}

export function MonthTile({ month }: MonthTileProps) {
  const node = month.nodes[0];
  return (
    <Link
      className="rounded-2xl p-2 m-2 overflow-hidden w-[30vw] h-[20vw] flex-auto grid grid-cols-1 grid-rows-[3em,1fr] bg-neutral-900"
      to={`/photos/${month.nodes[0].fields!.organization!.monthSlug}`}
    >
      <div className="text-white px-2 pt-2 shrink-0 z-10 flex items-baseline justify-between">
        <h2 className="text-2xl">
          {month.nodes[0].fields!.organization!.monthSlug?.split("/")[1]}
        </h2>
        <span className="text-neutral-400 text-sm">Sunsets, Waterfalls, Flowers</span>
      </div>
      <div className="rounded-lg flex relative overflow-auto">
        {month.nodes.map((node) => (
          <GatsbyImage
            alt={node.relativePath}
            className="flex-shrink-0 h-full mr-2"
            key={node.id}
            style={{
              aspectRatio: node.childImageSharp!.fluid!.aspectRatio,
            }}
            image={node.childImageSharp!.gatsbyImageData}
            // objectFit="contain"
            // objectPosition="center center"
          />
        ))}
      </div>
    </Link>
  );
}
