import React, { useCallback, useRef } from "react";

import { pathOr, take } from "ramda";
// import kebabCase from 'lodash/kebabCase';

import { HomepageImage } from "./pages";
import { GalleryImage } from "./pages/photogallery";

export const getMeta = <T extends GalleryImage | HomepageImage | Queries.PhotoImageQuery>(image: T) =>
  (image as GalleryImage).fields?.imageMeta;

export const getName = (image: GalleryImage) =>
  image.fields?.imageMeta?.meta?.ObjectName || image.base;

export const getVibrant = (image: GalleryImage | HomepageImage) =>
  // @ts-expect-error no queries grab this field rn
  getMeta(image)?.vibrant;

export const hasName = (image: GalleryImage) =>
  Boolean(image.fields?.imageMeta?.meta?.ObjectName);

export const getAspectRatio = (image: GalleryImage | HomepageImage): number =>
  image.childImageSharp?.fluid?.aspectRatio ?? 1;

export const getCanonicalSize = (image: GalleryImage) => ({
  height: image.childImageSharp?.gatsbyImageData.height,
  width: image.childImageSharp?.gatsbyImageData.width,
});

export const getRgba = (palette: string[], alpha: number) =>
  `rgba(${palette[0]}, ${palette[1]}, ${palette[2]}, ${alpha || 1})`;

// ??????? why do vibrant rgb triples sometimes have a 1 at the end?????
const maybeTake3 = <T>(arg: T | null) => arg ? take(3, arg as unknown[]) : [];

export const getVibrantStyle = (
  // vibrant: Queries.FileFieldsImageMetaVibrant,
  vibrant: any,
  screenHeight?: number
) => ({
  "--muted": maybeTake3(vibrant.Muted),
  "--dark-muted": maybeTake3(vibrant.DarkMuted),
  "--light-muted": maybeTake3(vibrant.LightMuted),
  "--vibrant": maybeTake3(vibrant.Vibrant),
  "--dark-vibrant": maybeTake3(vibrant.DarkVibrant),
  "--light-vibrant": maybeTake3(vibrant.LightVibrant),
  "--height-screen": screenHeight ? `${screenHeight}px` : "100vh",
});

// work around SSR bug in react-helmet
export const getHelmetSafeBodyStyle = (style: React.CSSProperties) => {
  if (typeof window === "undefined") {
    return style;
  }
  return (
    Object.keys(style)
      // @ts-ignore
      .map((key) => `${key}: ${style[key]};`)
      .join("")
  );
};

const gcd = (a: number, b: number): number => {
  if (b < 0.0000001) {
    return a; // Since there is a limited precision we need to limit the value.
  }

  return gcd(b, Math.floor(a % b)); // Discard any fractions due to limitations in precision.
};

export const getShutterFractionFromExposureTime = (exposureTime: number) => {
  if (exposureTime === 0.3333333333333333) {
    return "1/3";
  }
  if (exposureTime === 0.03333333333333333) {
    return "1/30";
  }
  if (exposureTime === 0.016666666666666666) {
    return "1/60";
  }
  if (exposureTime === 0.0011111111111111111) {
    return "1/900";
  }
  if (exposureTime === 0.06666666666666667) {
    return "1/15";
  }
  if (exposureTime === 0.16666666666666666) {
    return "1/6";
  }
  let fraction = exposureTime;
  const len = fraction.toString().length - 2;

  let denominator = Math.pow(10, len);
  let numerator = fraction * denominator;

  const divisor = gcd(numerator, denominator);

  numerator /= divisor;
  denominator /= divisor;
  if (numerator > 1) {
    return `${exposureTime}`;
  }
  return `${numerator}/${denominator}`;
};

interface galleryPageUrlProps {
  keyword: string | null;
  sortKey: string | null;
  showDebug: boolean;
}

export const getGalleryPageUrl = (
  { keyword, sortKey, showDebug }: galleryPageUrlProps,
  hash: string
) => {
  const url = new URL(
    `${
      typeof window !== "undefined"
        ? window.location.origin
        : "https://chuckdries.com"
    }/photogallery/`
  );
  if (keyword !== undefined) {
    if (keyword === null) {
      url.searchParams.delete("filter");
    } else {
      url.searchParams.set("filter", keyword);
    }
  }
  if (sortKey !== undefined) {
    if (sortKey === "rating" || sortKey === null) {
      url.searchParams.delete("sort");
    } else {
      url.searchParams.set("sort", sortKey);
    }
  }
  if (showDebug) {
    url.searchParams.set("debug", "true");
  }
  if (hash) {
    url.hash = hash;
  }
  return url.href.toString().replace(url.origin, "");
};

export function compareDates<T>(
  date_path: string[],
  left: T,
  right: T
): number {
  // why tf do my dates have newlines in them?!?!
  const date1 = new Date(pathOr("", date_path, left).replace(/\s/g, ""));
  const date2 = new Date(pathOr("", date_path, right).replace(/\s/g, ""));
  const diff = -1 * (date1.getTime() - date2.getTime());
  return diff;
}

export function round(num: number) {
  return +num.toFixed(3)
}


/**
 * Returns a memoized function that will only call the passed function when it hasn't been called for the wait period
 * @param func The function to be called
 * @param wait Wait period after function hasn't been called for
 * @returns A memoized function that is debounced
 */
export const useDebouncedCallback = (func: Function, wait: number) => {
  // Use a ref to store the timeout between renders
  // and prevent changes to it from causing re-renders
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  return useCallback(
    (...args: any) => {
      const later = () => {
        clearTimeout(timeout.current!);
        func(...args);
      };

      clearTimeout(timeout.current ?? undefined);
      timeout.current = setTimeout(later, wait);
    },
    [func, wait]
  );
};
