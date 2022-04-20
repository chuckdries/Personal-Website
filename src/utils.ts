// import kebabCase from 'lodash/kebabCase';

export const getMeta = (image: any) => image.fields.imageMeta;

export const getName = (image: any) =>
  getMeta(image)?.meta?.ObjectName || image.base;

// some pleasing default colors for SSR and initial hydration
export const getVibrant = (image: any) => getMeta(image)?.vibrant;

export const hasName = (image: any) => Boolean(getMeta(image)?.meta?.ObjectName);

export const getAspectRatio = (image: any) =>
  image.childImageSharp.fluid.aspectRatio;

export const getRgba = (palette: number[], alpha: number) =>
  `rgba(${palette[0]}, ${palette[1]}, ${palette[2]}, ${alpha || 1})`;

// work around SSR bug in react-helmet
export const getHelmetSafeBodyStyle = (vibrant: any, screenHeight: number) => {
  const style: {[key: string]: string} = {
    "--muted": vibrant.Muted,
    "--dark-muted": vibrant.DarkMuted,
    "--light-muted": vibrant.LightMuted,
    "--vibrant": vibrant.Vibrant,
    "--dark-vibrant": vibrant.DarkVibrant,
    "--light-vibrant": vibrant.LightVibrant,
    "--height-screen": screenHeight ? `${screenHeight}px` : '100vh'
  };
  if (typeof window === "undefined") {
    return style;
  }
  return Object.keys(style)
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
  if (exposureTime === 0.016666666666666666) {
    return '1/60'
  }
  const fraction = exposureTime;
  const len = fraction.toString().length - 2;

  let denominator = Math.pow(10, len);
  let numerator = fraction * denominator;

  const divisor = gcd(numerator, denominator);

  numerator /= divisor;
  denominator /= divisor;
  if (numerator > 1) {
    return `${exposureTime}`
  }
  return `${numerator}/${denominator}`;
};

import { RefObject } from 'react';

export const getRefElement = <T>(
  element?: RefObject<Element> | T
): Element | T | undefined | null => {
  if (element && 'current' in element) {
    return element.current;
  }

  return element;
};

export const isSSR = !(
  typeof window !== 'undefined' && window.document?.createElement
);
