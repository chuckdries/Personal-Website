import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useDimensions from "react-cool-dimensions";
import {
  animate,
  createScope,
  createAnimatable,
  utils,
  createSpring,
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
  const { observe: observeOuter, width } = useDimensions();

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
    if (!innerRef.current || !isClient) {
      return;
    }
    const scrollWidth = innerRef.current?.scrollWidth ?? 0;
    if (scrollWidth > width) {
      setWillAnimate(true);
      // @ts-expect-error whatevs bro
      scopeRef.current = createScope({
        root: innerRef.current,
        mediaQueries: {
          reduceMotion: "(prefers-reduced-motion)",
          touch: "(pointer: coarse)",
        },
      }).add((self) => {
        const { reduceMotion, touch } = self.matches;
        const animation = animate(innerRef.current!, {
          x: 0 - (scrollWidth - width),
          // ease: "cubicBezier(.21,.05,.73,.94)",
          // ease: 'inOut',
          loop: true,
          loopDelay: 1000,
          alternate: true,
          duration: reduceMotion ? 0 : (scrollWidth - width) * 20,
          autoplay: false,
        });
        self.add('play', (e)=>{
          animation.play();
        })
        self.add('pause', () => {
          animation.pause();
        })
      });

      return () => {
        scope.revert();
      };
    } else {
      setWillAnimate(false);
    }
  }, [width, isClient]);

  useEffect(() => {
    if (playing) {
      scopeRef.current?.methods.play();
    } else {
      scopeRef.current?.methods.pause();
    }
  }, [playing])

  if (!images) {
    return <></>;
  }
  return (
    <div
      className={classNames(
        willAnimate ? "" : "justify-center",
        "w-full flex gap-2 overflow-hidden h-[250px]",
      )}
      ref={observeOuter}
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
