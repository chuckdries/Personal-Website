import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { utils } from "@juliangarnierorg/anime-beta";
import { animate, useMotionValue, motion } from "motion/react";
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
  const images = useMemo(
    () => galleryImages && utils.shuffle(R.clone(galleryImages)),
    [galleryImages],
  );
  const { observe: observeOuter, width: outerWidth } = useDimensions();

  const innerRef = useRef<HTMLDivElement>(null);
  const innerWidth = innerRef.current?.scrollWidth ?? 0;

  const [willAnimate, setWillAnimate] = useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  const xTranslation = useMotionValue(0);
  useEffect(() => {
    if (!willAnimate) {
      xTranslation.set(0);
      return;
    }
    const endValue = -innerWidth - 12;
    const beginValue = xTranslation.get();
    const distanceRemaining = endValue - beginValue;
    const duration = distanceRemaining / -80;
    const controls = animate(xTranslation, [beginValue, endValue], {
      ease: "linear",
      duration: playing ? duration * 2 : duration,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
      autoplay: willAnimate,
    });
    return controls.stop;
  }, [innerWidth, willAnimate, playing, xTranslation]);

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

  if (!images) {
    return <></>;
  }
  return (
    <div
      className={classNames(
        willAnimate ? "" : "justify-center",
        "flex h-[250px] relative",
      )}
      ref={observeOuter}
    >
      <motion.div
        className="flex flex-nowrap gap-3"
        style={{ x: xTranslation }}
      >
        <div className="flex shrink-0 flex-nowrap gap-3" ref={innerRef}>
          {images.map((image, i) => (
            <Link
              className="shrink-0 rounded-md overflow-hidden hover:scale-105 hover:z-10 transition-transform"
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
                className="shrink-0 rounded-md overflow-hidden hover:scale-105 hover:z-10 transition-transform"
                key={`${image?.base}${i}`}
                to={to}
              >
                <GatsbyImage alt="" className="" image={getImage(image)!} />
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
