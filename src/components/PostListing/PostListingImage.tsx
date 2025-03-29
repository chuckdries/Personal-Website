import React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { GalleryImage } from "../../pages/photogallery";

export function PostListingImage({
  image,
  to,
}: {
  image: GalleryImage;
  to: string;
}) {
  if (!image) {
    return <></>;
  }
  return (
    <div
      className="rounded-md overflow-hidden min-h-full"
      style={{ aspectRatio: (image.childImageSharp?.fluid?.aspectRatio ?? 1) }}
    >
      <GatsbyImage
        alt=""
        className="h-full w-full"
        image={getImage(image)!}
      />
    </div>
  );
}
