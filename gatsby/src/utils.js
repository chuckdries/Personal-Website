export const getMeta = (image) => image.childImageSharp.fields.imageMeta

export const getName = (image) => getMeta(image).iptc.object_name || image.base