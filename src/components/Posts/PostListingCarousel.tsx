import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, { useEffect, useRef, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { animated, useSpring } from "@react-spring/web";

import { GalleryImages } from "../../pages/posts";

export function PostListingCarousel({
  galleryImages,
}: {
  galleryImages?: GalleryImages;
}) {
  const { observe: observeOuter, width } = useDimensions();

  const observeInner = useRef<HTMLDivElement>(null);
  const [showScrollPrompt, setScrollPrompt] = useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  useEffect(() => {
    if (!observeInner.current || !isClient) {
      return;
    }
    if (observeInner.current?.scrollWidth > width) {
      setScrollPrompt(true);
    } else {
      setScrollPrompt(false);
    }
  }, [width, isClient]);

  if (!galleryImages) {
    return <></>;
  }
  return (
    <div
      className="w-full flex gap-2 overflow-hidden h-[250px]"
      ref={observeOuter}
    >
      <div className="flex flex-nowrap" ref={observeInner}>
        {galleryImages.map((image) => (
          <GatsbyImage
            alt=""
            className="shrink-0"
            // @ts-expect-error idk man
            image={getImage(image)!}
            key={image?.base}
          />
        ))}
      </div>
    </div>
  );
}
