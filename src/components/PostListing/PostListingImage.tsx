import React from "react";
import type { CarouselImageData } from "../../types";

export function PostListingImage({
  image,
}: {
  image: CarouselImageData;
}) {
  if (!image) {
    return <></>;
  }
  return (
    <div
      className="rounded-md overflow-hidden min-h-full max-h-full"
      style={{ aspectRatio: image.aspectRatio }}
    >
      <img
        alt=""
        className="h-full w-full object-cover"
        src={image.src}
      />
    </div>
  );
}
