import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { HomepageImage } from "../../pages";

export function PostListingImage({
  image,
}: {
  image: HomepageImage;
}) {
  if (!image) {
    return <></>;
  }
  return (
    <div
      className="rounded-md overflow-hidden min-h-full max-h-full"
      style={{ aspectRatio: (image.childImageSharp?.fluid?.aspectRatio ?? 1) }}
    >
      <GatsbyImage
        alt=""
        className="h-full w-full"
        image={getImage(image.childImageSharp?.gatsbyImageData ?? null)!}
      />
    </div>
  );
}
