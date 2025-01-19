import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  createScope,
  createAnimatable,
  utils,
  createSpring,
} from "@juliangarnierorg/anime-beta";
import useDimensions from "react-cool-dimensions";
import * as R from "ramda";

import { GalleryImages } from "../../pages/posts";
import classNames from "classnames";
import { Link } from "gatsby";

export function PostListingCarousel({
  galleryImages,
  playing,
  to,
}: {
  galleryImages?: GalleryImages;
  playing: boolean;
  to: string;
}) {
  const { observe: observeOuter, width: outerWidth } = useDimensions();

  const innerRef = useRef<HTMLDivElement>(null);
  const innerWidth = innerRef.current?.scrollWidth ?? 0;
  const widthFactor = outerWidth && innerWidth && Math.floor(outerWidth / innerWidth);

  const filler = useMemo(() => widthFactor ? R.repeat(null, widthFactor + 1) : [], [widthFactor]);

  const animContainerRef = useRef<HTMLDivElement>(null);

  const [willAnimate, setWillAnimate] = useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  const images = useMemo(
    () =>
      galleryImages &&
      (isClient ? utils.shuffle(R.clone(galleryImages)) : galleryImages),
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
    const duration = distanceRemaining * 45;
    scopeRef.current = createScope({
      root: animContainerRef.current,
      mediaQueries: {
        reduceMotion: "(prefers-reduced-motion)",
        touch: "(pointer: coarse)",
      },
    }).add((self) => {
      const { reduceMotion, touch } = self.matches;
      const animation = animate(animContainerRef.current!, {
        x: endValue,
        ease: "linear",
        loop: true,
        duration: reduceMotion ? 0 : duration,
        autoplay: true,
      });
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
  }, [innerWidth, isClient]);

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
        willAnimate ? "" : "justify-center",
        "flex h-[250px] relative overflow-x-hidden overflow-y-visible max-w-[1280px] mx-auto xl:rounded-md",
      )}
      ref={observeOuter}
    >
      <div
        className="flex flex-nowrap gap-3 overflow-y-visible"
        ref={animContainerRef}
      >
        <div
          className={classNames(
            "flex shrink-0 flex-nowrap gap-3 transition duration-1000",
            isClient ? "opacity-100" : "opacity-0",
          )}
          ref={innerRef}
        >
          {isClient &&
            images.map((image, i) => (
              <Link
                className="shrink-0 rounded-md overflow-hidden"
                key={`${image?.base}${i}`}
                to={`${to}#${image?.base}`}
              >
                <GatsbyImage alt="" className="" image={getImage(image)!} />
              </Link>
            ))}
        </div>
        {filler.map((_, i) => (
          <div className="flex shrink-0 flex-nowrap gap-3" key={`filler-${i}`}>
            {images.map((image, i) => (
              <Link
                className="shrink-0 rounded-md overflow-hidden"
                key={`${image?.base}${i}`}
                to={to}
              >
                <GatsbyImage alt="" className="" image={getImage(image)!} />
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
