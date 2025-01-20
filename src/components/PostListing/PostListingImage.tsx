import React from "react";
import { Link } from "gatsby";
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
    <Link
      className="rounded-md overflow-hidden h-full"
      style={{ aspectRatio: (image.childImageSharp?.fluid?.aspectRatio ?? 1) }}
      to={`${to}#${image?.base}`}
    >
      <GatsbyImage
        alt=""
        className="h-full"
        image={getImage(image)!}
      />
    </Link>
  );
}
