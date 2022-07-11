// import kebabCase from 'lodash/kebabCase';

export const getMeta = (image) => image.fields.imageMeta;

export const getName = (image) =>
  getMeta(image)?.meta?.ObjectName || image.base;

// some pleasing default colors for SSR and initial hydration
export const getVibrant = (image) => getMeta(image)?.vibrant;

export const hasName = (image) => Boolean(getMeta(image)?.meta?.ObjectName);

export const getAspectRatio = (image) =>
  image.childImageSharp.fluid.aspectRatio;

export const getCanonicalSize = (image) => ({
  height: image.childImageSharp.gatsbyImageData.height,
  width: image.childImageSharp.gatsbyImageData.width,
});

export const getRgba = (palette, alpha) =>
  `rgba(${palette[0]}, ${palette[1]}, ${palette[2]}, ${alpha || 1})`;

// work around SSR bug in react-helmet
export const getHelmetSafeBodyStyle = (vibrant, screenHeight) => {
  const style = {
    "--muted": vibrant.Muted,
    "--dark-muted": vibrant.DarkMuted,
    "--light-muted": vibrant.LightMuted,
    "--vibrant": vibrant.Vibrant,
    "--dark-vibrant": vibrant.DarkVibrant,
    "--light-vibrant": vibrant.LightVibrant,
    "--height-screen": screenHeight ? `${screenHeight}px` : "100vh",
  };
  if (typeof window === "undefined") {
    return style;
  }
  return Object.keys(style)
    .map((key) => `${key}: ${style[key]};`)
    .join("");
};

const gcd = (a, b) => {
  if (b < 0.0000001) {
    return a; // Since there is a limited precision we need to limit the value.
  }

  return gcd(b, Math.floor(a % b)); // Discard any fractions due to limitations in precision.
};

export const getShutterFractionFromExposureTime = (exposureTime) => {
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

export const getGalleryPageUrl = (
  { keyword, sortKey },
  hash
) => {
  const url = new URL(`${window.location.origin}/photogallery/`);
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
  return url.href.toString().replace(url.origin, '');
};
