// import kebabCase from 'lodash/kebabCase';

export const getMeta = (image) => image.childImageSharp.fields.imageMeta;

export const getName = (image) => getMeta(image)?.iptc.object_name || image.base;

// some pleasing default colors for SSR and initial hydration
export const getVibrant = (image) => getMeta(image)?.vibrant;

export const hasName = (image) => Boolean(getMeta(image)?.iptc.object_name);

export const getAspectRatio = (image) => image.childImageSharp.fluid.aspectRatio;

export const getRgba = (palette, alpha) => `rgba(${palette[0]}, ${palette[1]}, ${palette[2]}, ${alpha || 1})`;

// work around SSR bug in react-helmet
export const getVibrantToHelmetSafeBodyStyle = (vibrant) => {
  const style = {
    '--muted': vibrant.Muted.rgb,
    '--dark-muted': vibrant.DarkMuted.rgb,
    '--light-muted': vibrant.LightMuted.rgb,
    '--vibrant': vibrant.Vibrant.rgb,
    '--dark-vibrant': vibrant.DarkVibrant.rgb,
    '--light-vibrant': vibrant.LightVibrant.rgb,
  };
  if (typeof window === 'undefined') {
    return style;
  }
  return Object.keys(style).map(key => `${(key)}: ${style[key]}`).join(';');
};

const gcd = (a, b) => {
  if (b < 0.0000001) {
    return a; // Since there is a limited precision we need to limit the value.
  }

  return gcd(b, Math.floor(a % b)); // Discard any fractions due to limitations in precision.
};

export const getShutterFractionFromExposureTime = (exposureTime) => {
  let fraction = exposureTime;
  var len = fraction.toString().length - 2;
  
  var denominator = Math.pow(10, len);
  var numerator = fraction * denominator;
  
  var divisor = gcd(numerator, denominator);
  
  numerator /= divisor;
  denominator /= divisor;
  return `${numerator}/${denominator}`;
};