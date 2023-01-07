// import kebabCase from 'lodash/kebabCase';

import { HomepageImage } from "./pages";
import { GalleryImage } from "./pages/photogallery";

export const getMeta = <T extends GalleryImage | HomepageImage>(image: T) => image.fields?.imageMeta;

export const getName = (image: GalleryImage) =>
image.fields?.imageMeta?.meta?.ObjectName || image.base;

// some pleasing default colors for SSR and initial hydration
export const getVibrant = (image: GalleryImage | HomepageImage) => getMeta(image)?.vibrant;

export const hasName = (image: GalleryImage) => Boolean(image.fields?.imageMeta?.meta?.ObjectName);

export const getAspectRatio = (image: GalleryImage | HomepageImage): number =>
  image.childImageSharp?.fluid?.aspectRatio ?? 1;

export const getCanonicalSize = (image: GalleryImage) => ({
  height: image.childImageSharp?.gatsbyImageData.height,
  width: image.childImageSharp?.gatsbyImageData.width,
});

export const getRgba = (palette: string[], alpha: number) =>
  `rgba(${palette[0]}, ${palette[1]}, ${palette[2]}, ${alpha || 1})`;

export const getVibrantStyle = (vibrant: Queries.FileFieldsImageMetaVibrant, screenHeight?: number) => ({
  "--muted": vibrant.Muted,
  "--dark-muted": vibrant.DarkMuted,
  "--light-muted": vibrant.LightMuted,
  "--vibrant": vibrant.Vibrant,
  "--dark-vibrant": vibrant.DarkVibrant,
  "--light-vibrant": vibrant.LightVibrant,
  "--height-screen": screenHeight ? `${screenHeight}px` : "100vh",
});

// work around SSR bug in react-helmet
export const getHelmetSafeBodyStyle = (vibrant: Queries.FileFieldsImageMetaVibrant, screenHeight?: number) => {
  const style = getVibrantStyle(vibrant, screenHeight);
  if (typeof window === "undefined") {
    return style;
  }
  return Object.keys(style)
  // @ts-ignore
    .map((key) => `${key}: ${style[key]};`)
    .join("");
};

const gcd = (a: number, b: number): number => {
  if (b < 0.0000001) {
    return a; // Since there is a limited precision we need to limit the value.
  }

  return gcd(b, Math.floor(a % b)); // Discard any fractions due to limitations in precision.
};

export const getShutterFractionFromExposureTime = (exposureTime: number) => {
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
  sortKey: string;
}

export const getGalleryPageUrl = ({ keyword, sortKey }: galleryPageUrlProps, hash: string) => {
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
    if (sortKey === "rating") {
      url.searchParams.delete("sort");
    } else {
      url.searchParams.set("sort", sortKey);
    }
  }
  if (hash) {
    url.hash = hash;
  }
  return url.href.toString().replace(url.origin, "");
};
