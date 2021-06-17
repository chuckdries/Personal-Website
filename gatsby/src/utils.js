// import kebabCase from 'lodash/kebabCase';

export const getMeta = (image) => image.childImageSharp.fields.imageMeta;

export const getName = (image) => getMeta(image)?.iptc.object_name || image.base;

export const getVibrant = (image) => getMeta(image)?.vibrant;

export const hasName = (image) => Boolean(getMeta(image)?.iptc.object_name);

export const getAspectRatio = (image) => image.childImageSharp.fluid.aspectRatio;

export const getRgba = (palette, alpha) => `rgba(${palette[0]}, ${palette[1]}, ${palette[2]}, ${alpha || 1})`;

export const getVibrantToHelmetSafeBodyStyle = (vibrant) => {
  const style = {
    '--muted': vibrant.Muted,
    '--dark-muted': vibrant.DarkMuted,
    '--light-muted': vibrant.LightMuted,
    '--vibrant': vibrant.Vibrant,
    '--dark-vibrant': vibrant.DarkVibrant,
    '--light-vibrant': vibrant.LightVibrant,
  }
  if (typeof window === 'undefined') {
    return style;
  }
  return Object.keys(style).map(key => `${(key)}: ${style[key]}`).join(';');
};
