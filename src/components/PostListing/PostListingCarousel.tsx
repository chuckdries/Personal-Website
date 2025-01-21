import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  createScope,
  createAnimatable,
  utils,
  createSpring,
  createTimeline,
} from "@juliangarnierorg/anime-beta";
import useDimensions from "react-cool-dimensions";
import * as R from "ramda";

import { GalleryImages } from "../../pages/posts";
import classNames from "classnames";
import { Link } from "gatsby";
import { PostListingImage } from "./PostListingImage";

export function PostListingCarousel({
  galleryImages,
  playing,
  to,
}: {
  galleryImages?: GalleryImages;
  playing: boolean;
  to: string;
}) {
  const { observe: observeOuter, width: outerWidth, height } = useDimensions();

  const { observe: observeInner, width: innerWidth } = useDimensions();
  const widthFactor =
    outerWidth && innerWidth && Math.ceil(outerWidth / innerWidth);

  const filler = useMemo(
    () => (widthFactor ? R.repeat(null, widthFactor) : [null]),
    [widthFactor],
  );

  const animContainerRef = useRef<HTMLDivElement>(null);

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  const images: typeof galleryImages = useMemo(
    () =>
      galleryImages &&
      (isClient ? utils.shuffle(R.clone(galleryImages)) : galleryImages),
    [galleryImages, isClient],
  );

  const aspectRatios = useMemo(
    () => images?.map((image) => image?.childImageSharp?.fluid?.aspectRatio),
    [images],
  );

  const scopeRef = useRef<ReturnType<typeof createScope>>();
  useEffect(() => {
    if (!isClient || !animContainerRef.current) {
      return;
    }
    const endValue = -innerWidth - 12;
    const beginValue = 0;
    const distanceRemaining = Math.abs(endValue - beginValue);
    const duration = distanceRemaining * 45;
    scopeRef.current = createScope({
      root: animContainerRef.current,
      mediaQueries: {
        reduceMotion: "(prefers-reduced-motion)",
        touch: "(pointer: coarse)",
      },
    }).add((self) => {
      const { reduceMotion, touch } = self.matches;
      if (reduceMotion) {
        return;
      }
      const tl = createTimeline({
        loop: true,
        defaults: {
          duration: 1000,
          ease: "inOutCubic",
          autoplay: true,
        },
      });
      const ratio = aspectRatios?.reduce((ratioSum = 0, ratio, index) => {
        if (!ratio) {
          return ratioSum;
        }
        const widthSum = ratioSum * height;
        const width = ratio * height;
        const duration = 200;
        const timelinePoint = (index + 1) * 2000;
        const finalPosition = index === aspectRatios.length - 1;
        tl.add(
          animContainerRef.current!,
          {
            x: -1 * (widthSum + width + ((index + 1) * 12)),
          },
          timelinePoint,
        );
        return ratioSum + ratio;
      }, 0);
      self.add("play", () => {
        // animation.play();
      });
      self.add("pause", () => {
        // animation.pause();
      });
    });

    return () => {
      scopeRef.current?.revert();
    };
  }, [innerWidth, outerWidth, isClient, height, aspectRatios]);

  // useEffect(() => {
  //   if (!isClient) {
  //     return;
  //   }
  //   if (innerWidth > outerWidth) {
  //     setWillAnimate(true);
  //   } else {
  //     setWillAnimate(false);
  //   }
  // }, [isClient, innerWidth, outerWidth]);

  if (!images) {
    return <></>;
  }

  return (
    <div
      className={classNames(
        // willAnimate ? "" : "justify-center",
        "prog-blur-x",
        "flex max-h-[30vw] max-w-[1280px] items-stretch relative overflow-x-hidden mx-auto",
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
              <PostListingImage
                image={image}
                key={`${image?.base}${i}`}
                to={to}
              />
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
              <PostListingImage
                image={image}
                key={`${image?.base}${i}`}
                to={to}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
