import { Link, PageProps } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";
import { getPostImage } from "./getPostImage";
// import "../photos/PhotoImage/PhotoImage.css";
import { useDateFormatter } from "react-aria";
import { getShutterFractionFromExposureTime } from "../../utils";
import { FilmstockKeywords } from "../photos/PhotoImage/PhotoImage";

export function PostImage({
  props,
  index,
  alt,
}: {
  props: PageProps<Queries.PostPageQuery>;
  index: number;
  alt?: string;
}) {
  const image = getPostImage(props, index);
  const meta = image?.fields?.imageMeta?.meta;
  const film = meta?.Keywords?.includes("Film");
  const df = useDateFormatter({
    timeZone: 'America/Los_Angeles'
  });
  const filmStock = React.useMemo(
    () =>
      film
        ? meta?.Keywords?.find((k) => k && FilmstockKeywords.includes(k))
        : null,
    [film, meta],
  );
  if (!image) {
    console.log("image not found", { index, props });
    return <></>;
  }

  return (
    <div
      className="block my-2 flex-shrink-0 group"
      id={image.base}
      style={{
        maxWidth: `min(calc(${image.childImageSharp?.fluid?.aspectRatio} * 85vh), calc(100vw - 32px))`,
        // maxHeight: "calc(100vh - 2em)",
      }}
    >
      <GatsbyImage
        alt={`A photo calleed ${image.base}`}
        className="overflow-visible not-prose"
        // @ts-expect-error shrug
        image={getImage(image)!}
        style={
          {
            // "--img-src": `url('${image!.childImageSharp!.gatsbyImageData.placeholder!.fallback}')`,
          }
        }
      />
      <Link
        className="t-0 block opacity-0 group-hover:opacity-100 transition-opacity"
        to={`/${image.fields?.organization?.slug}`}
      >
        {!film && (
          <div className="text-sm float-right flex gap-2">
            {image.fields?.imageMeta?.meta?.ExposureTime && (
              <span>
                {getShutterFractionFromExposureTime(
                  image.fields?.imageMeta?.meta?.ExposureTime,
                )}
                s
              </span>
            )}
            {image.fields?.imageMeta?.meta?.FNumber && (
              <span>f/{image.fields?.imageMeta?.meta?.FNumber}</span>
            )}
            {image.fields?.imageMeta?.meta?.ISO && (
              <span>{image.fields?.imageMeta?.meta?.ISO} ISO</span>
            )}
          </div>
        )}
        {film && filmStock && (
          <div className="text-sm float-right flex gap-2">
            <span>{filmStock}</span>
          </div>
        )}
        {image.fields?.imageMeta?.dateTaken && (
          <span className="text-sm">
            {df.format(new Date(image.fields?.imageMeta?.dateTaken))}
          </span>
        )}
      </Link>
    </div>
  );
}
