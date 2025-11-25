import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  createScope,
} from "@juliangarnierorg/anime-beta";
import useDimensions from "react-cool-dimensions";
import * as R from "ramda";
import classNames from "classnames";

type PhotoNode = {
  id: string;
  childImageSharp?: {
    gatsbyImageData?: any;
    fluid?: {
      aspectRatio?: number;
    } | null;
  } | null;
};

interface KeywordCardRowProps {
  images: PhotoNode[];
  playing: boolean;
  fixedHeight: number;
}

export function KeywordCardRow({
  images,
  playing,
  fixedHeight,
}: KeywordCardRowProps) {
  const { observe: observeOuter, width: outerWidth } = useDimensions();
  const { observe: observeInner, width: innerWidth } = useDimensions();
  
  const widthFactor =
    outerWidth && innerWidth && innerWidth > 0
      ? Math.floor(outerWidth / innerWidth) + 1
      : 1;

  const filler = useMemo(
    () => (widthFactor ? R.repeat(null, widthFactor) : [null]),
    [widthFactor],
  );

  const animContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  const scopeRef = useRef<ReturnType<typeof createScope>>();
  useEffect(() => {
    if (!isClient || !animContainerRef.current || !innerWidth) {
      return;
    }
    const endValue = -innerWidth - 12;
    const beginValue = 0;
    const distanceRemaining = Math.abs(endValue - beginValue);
    const duration = distanceRemaining * 55;
    
    scopeRef.current = createScope({
      root: animContainerRef.current,
      mediaQueries: {
        reduceMotion: "(prefers-reduced-motion)",
        touch: "(pointer: coarse)",
      },
    }).add((self) => {
      const { reduceMotion } = self.matches;
      animate(animContainerRef.current!, {
        x: endValue,
        ease: "linear",
        loop: true,
        duration: reduceMotion || !playing ? 0 : duration,
        autoplay: true,
      });
    });

    return () => {
      scopeRef.current?.revert();
    };
  }, [innerWidth, outerWidth, isClient, playing]);

  if (!images || images.length === 0) {
    return <></>;
  }

  return (
    <div
      className="flex items-stretch relative overflow-x-hidden w-full"
      ref={observeOuter}
      style={{ height: fixedHeight }}
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
            images.map((image, i) => {
              const aspectRatio = image.childImageSharp?.fluid?.aspectRatio ?? 1;
              const width = fixedHeight * aspectRatio;
              const gatsbyImage = getImage(image.childImageSharp?.gatsbyImageData ?? null);
              
              if (!gatsbyImage) return null;
              
              return (
                <div
                  key={`${image.id}-${i}`}
                  className="shrink-0 overflow-hidden rounded-md"
                  style={{ width: `${width}px`, height: `${fixedHeight}px` }}
                >
                  <GatsbyImage
                    alt=""
                    className="h-full w-full"
                    image={gatsbyImage}
                  />
                </div>
              );
            })}
        </div>
        {filler.map((_, i) => (
          <div
            className={classNames(
              "flex shrink-0 flex-nowrap gap-3 transition duration-1000",
              isClient ? "opacity-100" : "opacity-0",
            )}
            key={`filler-${i}`}
          >
            {images.map((image, j) => {
              const aspectRatio = image.childImageSharp?.fluid?.aspectRatio ?? 1;
              const width = fixedHeight * aspectRatio;
              const gatsbyImage = getImage(image.childImageSharp?.gatsbyImageData ?? null);
              
              if (!gatsbyImage) return null;
              
              return (
                <div
                  key={`${image.id}-filler-${i}-${j}`}
                  className="shrink-0 overflow-hidden rounded-md"
                  style={{ width: `${width}px`, height: `${fixedHeight}px` }}
                >
                  <GatsbyImage
                    alt=""
                    className="h-full w-full"
                    image={gatsbyImage}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

