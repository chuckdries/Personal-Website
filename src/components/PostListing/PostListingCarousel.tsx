import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useDimensions from "react-cool-dimensions";
import {
  animate,
  createScope,
  createAnimatable,
  utils,
  createSpring,
  onScroll,
  createTimer,
} from "@juliangarnierorg/anime-beta";
import * as R from "ramda";

import { GalleryImages } from "../../pages/posts";
import classNames from "classnames";

export function PostListingCarousel({
  galleryImages,
  playing,
}: {
  galleryImages?: GalleryImages;
  playing: boolean;
}) {
  const images = useMemo(
    () => galleryImages && R.take(15, galleryImages),
    [galleryImages],
  );
  const outerRef = useRef<HTMLDivElement>(null);
  // const { observe: observeOuter, width } = useDimensions();
  // observeOuter(outerRef.current)

  const innerRef = useRef<HTMLDivElement>(null);
  const [willAnimate, setWillAnimate] = useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  const scopeRef = useRef<ReturnType<typeof createScope>>(null);
  useEffect(() => {
    if (!outerRef.current || !innerRef.current || !isClient) {
      return;
    }
    const scrollWidth = innerRef.current?.scrollWidth ?? 0;
    const outerWidth = outerRef.current?.clientWidth ?? 0;
    if (scrollWidth > outerWidth) {
      setWillAnimate(true);
      // @ts-expect-error whatevs bro
      scopeRef.current = createScope({
        mediaQueries: {
          reduceMotion: "(prefers-reduced-motion)",
          touch: "(pointer: coarse)",
        },
      }).add((self) => {
        const duration = (scrollWidth - outerWidth) * 20;
        const { reduceMotion, touch } = self.matches;
        const animation = animate(outerRef.current!, {
          // x: 0 - (innerWidth - width),
          scrollLeft: 0,
          ease: 'out',
          loop: true,
          loopDelay: 1000,
          alternate: true,
          duration: reduceMotion ? 0 : (scrollWidth - outerWidth) * 20,
          autoplay: true,
        });
        self.add("play", (e) => {
          animation.play();
        });
        self.add("pause", () => {
          animation.pause();
        });
      });

      return () => {
        scopeRef.current?.revert();
      };
    } else {
      setWillAnimate(false);
    }
  }, [isClient]);

  useEffect(() => {
    if (playing) {
      scopeRef.current?.methods.play();
    } else {
      scopeRef.current?.methods.pause();
    }
  }, [playing]);

  if (!images) {
    return <></>;
  }
  return (
    <div
      className={classNames(
        willAnimate ? "" : "justify-center",
        "flex gap-2 overflow-x-auto overflow-y-hidden h-[250px]",
      )}
      ref={outerRef}
    >
      <div className="flex flex-nowrap" ref={innerRef}>
        {images.map((image) => (
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
