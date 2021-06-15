export const getMeta = (image) => image.childImageSharp.fields.imageMeta;

export const getName = (image) => getMeta(image)?.iptc.object_name || image.base;

export const hasName = (image) => Boolean(getMeta(image)?.iptc.object_name);

export const getAspectRatio = (image) => image.childImageSharp.fluid.aspectRatio;
