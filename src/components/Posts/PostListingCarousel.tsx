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
}: {
  galleryImages?: GalleryImages;
}) {
  const images = useMemo(
    () => galleryImages && R.take(15, galleryImages),
    [galleryImages],
  );
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
    const scrollWidth = observeInner.current?.scrollWidth ?? 0;
    if (scrollWidth > width) {
      setScrollPrompt(true);
      const scope = createScope({
        root: observeInner.current,
        mediaQueries: {
          reduceMotion: "(prefers-reduced-motion)",
          touch: "(pointer: coarse)",
        },
      }).add((self) => {
        const { reduceMotion, touch } = self.matches;
        if (reduceMotion) {
          return;
        }
        if (touch) {
          animate(observeInner.current!, {
            x: 0 - (scrollWidth - width),
            ease: "cubicBezier(.21,.05,.73,.94)",
            loop: true,
            loopDelay: 1000,
            alternate: true,
            duration: reduceMotion ? 0 : (scrollWidth - width) * 15,
          });
        } else {
          const animatableCarousel = createAnimatable(observeInner.current!, {
            x: 0,
            // composition: 'blend',
            // // ease: createSpring()
            // ease:"cubicBezier(.21,.05,.73,.94)"
          });
          const mouseMoveListener = (e: MouseEvent) => {
            const progress = utils.clamp((width - e.x) / width, 0, 1);
            const val = utils.lerp(0, 0 - (scrollWidth - width), progress);
            animatableCarousel.x(val);
          };
          self.add("mousemove", mouseMoveListener);
        }
      });
      window.addEventListener("mousemove", scope.methods.mousemove);
      return () => {
        window.removeEventListener("mousemove", scope.methods.mousemove);
        scope.revert();
      };
    } else {
      setScrollPrompt(false);
    }
  }, [width, isClient]);

  if (!images) {
    return <></>;
  }
  return (
    <div
      className={classNames(
        showScrollPrompt ? "" : "justify-center",
        "w-full flex gap-2 overflow-hidden h-[250px]",
      )}
      ref={observeOuter}
    >
      <div className="flex flex-nowrap" ref={observeInner}>
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
