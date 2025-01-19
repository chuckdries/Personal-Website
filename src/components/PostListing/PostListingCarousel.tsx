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

  const animContainerRef = useRef<HTMLDivElement>(null);

  const [willAnimate, setWillAnimate] = useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  const images = useMemo(
    () => galleryImages && (isClient ? utils.shuffle(R.clone(galleryImages)) : galleryImages),
    [galleryImages, isClient],
  );

  const scopeRef = useRef<ReturnType<typeof createScope>>();
  useEffect(() => {
    if (!willAnimate || !animContainerRef.current) {
      return;
    }
    const endValue = -innerWidth - 12;
    const beginValue = 0;
    const distanceRemaining = Math.abs(endValue - beginValue);
    const duration = distanceRemaining * 12;
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
        ease: 'linear',
        loop: true,
        duration: reduceMotion ? 0 : duration,
        autoplay: touch,
      });
      self.add('play', ()=>{
        animation.play();
      })
      self.add('pause', () => {
        animation.pause();
      })
    });

    return () => {
      scopeRef.current?.revert();
    };
  }, [innerWidth, willAnimate]);

  useEffect(() => {
    if (!isClient) {
      return;
    }
    if (innerWidth > outerWidth) {
      setWillAnimate(true);
    } else {
      setWillAnimate(false);
    }
  }, [isClient, innerWidth, outerWidth]);

  useEffect(() => {
    if (!isClient || !scopeRef.current) {
      return;
    }
    if (playing) {
      scopeRef.current.methods.play?.();
    } else {
      scopeRef.current.methods.pause?.();
    }
  }, [isClient, playing]);

  if (!images) {
    return <></>;
  }
  return (
    <div
      className={classNames(
        willAnimate ? "" : "justify-center",
        "flex h-[250px] relative overflow-x-hidden overflow-y-visible",
      )}
      ref={observeOuter}
    >
      <div
        className="flex flex-nowrap gap-3 overflow-y-visible"
        ref={animContainerRef}
      >
        <div className="flex shrink-0 flex-nowrap gap-3" ref={innerRef}>
          {images.map((image, i) => (
            <Link
              className="shrink-0 rounded-md overflow-hidden"
              key={`${image?.base}${i}`}
              to={`${to}#${image?.base}`}
            >
              <GatsbyImage alt="" className="" image={getImage(image)!} />
            </Link>
          ))}
        </div>
        {willAnimate && (
          <div className="flex shrink-0 flex-nowrap gap-3">
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
        )}
      </div>
    </div>
  );
}
