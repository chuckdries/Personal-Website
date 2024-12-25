import { Link, PageProps } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";
import { getPostImage } from "./getPostImage";
import "../photos/PhotoImage/PhotoImage.css";
import { useDateFormatter } from "react-aria";

export function PostImage({
  props,
  index,
  alt,
}: {
  props: PageProps<Queries.PostPageQuery>;
  index: number;
  alt: string;
}) {
  const image = getPostImage(props, index);
  const df = useDateFormatter({
    timeZone: "utc",
  });
  if (!image) {
    return <></>;
  }
  return (
    <Link
      className="block my-7 w-full flex-shrink-0"
      // style={{
      //   aspectRatio:
      //     image.childImageSharp?.gatsbyImageData.height /
      //     image.childImageSharp?.gatsbyImageData.width,
      // }}
      to={`/${image.fields?.organization?.slug}`}
    >
      <GatsbyImage
        alt={alt}
        className="not-prose max-h-screen"
        // @ts-expect-error shrug
        image={getImage(image)!}
        style={{
          "--img-src": `url('${image!.childImageSharp!.gatsbyImageData.placeholder!.fallback}')`,
        }}
      />
      <div className="t-0">
        {image.fields?.imageMeta?.dateTaken && (
          <span className="text-sm">
            {df.format(new Date(image.fields?.imageMeta?.dateTaken))}
          </span>
        )}
      </div>
    </Link>
  );
}
