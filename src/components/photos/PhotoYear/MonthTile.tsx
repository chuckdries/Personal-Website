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
      className="rounded-lg m-2 overflow-hidden w-[30vw] h-[30vh] flex-auto grid grid-cols-1 grid-rows-1 "
      to={`/photos/${month.nodes[0].fields!.organization!.monthSlug}`}
    >
      {/* {month.fieldValue} {month.score} */}
      {month.nodes.slice(0, 1).map((node) => (
        <GatsbyImage
          key={node.id}
          alt={node.relativePath}
          className="h-full w-full col-span-full row-span-full blur"
          image={node.childImageSharp!.gatsbyImageData}
          objectFit="cover"
          objectPosition="center center"
        />
      ))}
      <div className="text-white col-span-full row-span-full z-10 flex justify-center items-center">
        <h2 className="text-4xl font-bold">{new Date(2024, month.fieldValue, 1).toLocaleString("en", {
          month: "long",
        })}</h2>
      </div>
    </Link>
  );
}
