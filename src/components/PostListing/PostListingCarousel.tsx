import React, { useEffect, useMemo, useRef, useState } from "react";
import { animate, createScope, utils, waapi } from "animejs";
import useDimensions from "react-cool-dimensions";
import * as R from "ramda";

import { GalleryImages } from "../../pages/posts";
import classNames from "classnames";
import { PostListingImage } from "./PostListingImage";

export function PostListingCarousel({
  galleryImages,
  playing,
  fullWidth,
  shuffle = true,
}: {
  galleryImages?: GalleryImages;
  playing: boolean;
  fullWidth?: boolean;
  shuffle?: boolean;
}) {
  const { observe: observeOuter, width: outerWidth } = useDimensions();

  const { observe: observeInner, width: innerWidth } = useDimensions();
  const widthFactor =
    outerWidth && innerWidth && Math.floor(outerWidth / innerWidth);

  const filler = useMemo(
    () => (widthFactor ? R.repeat(null, widthFactor + 1) : [null]),
    [widthFactor],
  );

  const animContainerRef = useRef<HTMLDivElement>(null);
  const animProgressRef = useRef(0);

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  const images: typeof galleryImages = useMemo(
    () =>
      galleryImages &&
      (isClient && shuffle
        ? utils.shuffle(R.clone(galleryImages))
        : galleryImages),
    [galleryImages, isClient],
  );

  const scopeRef = useRef<ReturnType<typeof createScope>>();
  useEffect(() => {
    if (!isClient || !animContainerRef.current) {
      return;
    }
    const endValue = -innerWidth - 12;
    const beginValue = 0;
    const distanceRemaining = Math.abs(endValue - beginValue);
    const duration = distanceRemaining * 40;
    scopeRef.current = createScope({
      root: animContainerRef.current,
      mediaQueries: {
        reduceMotion: "(prefers-reduced-motion)",
        touch: "(pointer: coarse)",
      },
    }).add((self) => {
      const { reduceMotion, touch } = self.matches;
      const animation = waapi.animate(animContainerRef.current!, {
        x: endValue,
        ease: "linear",
        loop: true,
        duration: reduceMotion || !playing ? 0 : duration,
        autoplay: true,
      });

      self.add("slow", () => {
        animation.speed = 0.5;
      });
      self.add("fast", () => {
        animation.speed = 1;
      });
    });

    return () => {
      scopeRef.current?.revert();
    };
  }, [innerWidth, outerWidth, isClient]);

  if (!images) {
    return <></>;
  }

  return (
    <div
      onMouseEnter={() => {
        scopeRef.current?.methods.slow();
      }}
      onMouseLeave={() => {
        scopeRef.current?.methods.fast();
      }}
      className={classNames(
        "prog-blur-x",
        "flex items-stretch relative overflow-x-hidden mx-auto",
        fullWidth
          ? "max-w-full max-h-[min(40vw,30vh)]"
          : "max-w-[1280px] max-h-[25vw]",
      )}
      ref={observeOuter}
    >
      <div
        className="flex flex-nowrap items-stretch gap-3"
        ref={animContainerRef}
      >
        <div
          className={classNames(
            "flex shrink-0 flex-nowrap gap-3 transition duration-1000 items-stretch",
            isClient ? "opacity-100" : "opacity-0",
          )}
          ref={observeInner}
        >
          {isClient &&
            images.map((image, i) => (
              <PostListingImage image={image!} key={`${image?.base}${i}`} />
            ))}
        </div>
        {filler.map((_, i) => (
          <div
            className={classNames(
              "flex shrink-0 flex-nowrap gap-3 transition duration-1000",
              isClient ? "opacity-100" : "opacity-0",
            )}
            key={`filler-${i}`}
          >
            {images.map((image, i) => (
              <PostListingImage image={image!} key={`${image?.base}${i}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
