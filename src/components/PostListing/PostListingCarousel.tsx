import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { utils } from "@juliangarnierorg/anime-beta";
import { useSpring, animated } from "@react-spring/web";
import useDimensions from "react-cool-dimensions";
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
    () => galleryImages && R.take(10, utils.shuffle(galleryImages)),
    [galleryImages],
  );
  const outerRef = useRef<HTMLDivElement>(null);
  const { observe: observeOuter, width: outerWidth } = useDimensions();
  observeOuter(outerRef.current);

  const innerRef = useRef<HTMLDivElement>(null);
  const [willAnimate, setWillAnimate] = useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  const [direction, setDirection] = useState(1);
  console.log("🚀 ~ direction:", direction)
  const progressRef = useRef<number>(0);
  const endValue = 0 -
  ((innerRef.current?.scrollWidth ?? outerWidth) - outerWidth)
  const translateX = endValue;
  const [scrollSpring, scrollApi] = useSpring(
    () => ({
      translateX: playing ? translateX : 0,
      onChange: (props: any) => {
        progressRef.current = props.value.translateX;
      },
      onRest(result, ctrl, item) {
        // if (result.value.translateX === translateX) {
        //   ctrl.start({
        //     translateX: 0
        //   })
        // }
      },
      // onRest: (value) => {
      //   if (progressRef.current === translateX) {
      //     setDirection(-1 * direction);
      //   }
      // },
      // pause: !playing,
      config: {
        // duration: -1 * translateX * 2,
        friction: 200,
        tension: 7,
        mass: 3
      },
    }),
    [playing],
  );

  useEffect(() => {
    if (!innerRef.current || !isClient) {
      return;
    }
    if (innerRef.current.scrollWidth > outerWidth) {
      setWillAnimate(true)
    } else {
      setWillAnimate(false)
    }
  }, [isClient, outerWidth])

  if (!images) {
    return <></>;
  }
  return (
    <div
      className={classNames(
        willAnimate ? "" : "justify-center",
        "flex gap-2 overflow-hidden h-[250px] relative",
      )}
      ref={outerRef}
    >
      <animated.div
        style={scrollSpring}
        className="flex flex-nowrap"
        ref={innerRef}
      >
        {images.map((image) => (
          <GatsbyImage
            alt=""
            className="shrink-0"
            // @ts-expect-error idk man
            image={getImage(image)!}
            key={image?.base}
          />
        ))}
      </animated.div>
    </div>
  );
}
