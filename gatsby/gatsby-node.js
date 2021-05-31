const fs = require('fs');
const util = require('util')
const { read } = require('fast-exif');
const iptc = require('node-iptc');

const readFile = util.promisify(fs.readFile)


function convertDMSToDD(dms, positiveDirection) {
  const res = dms
    .map((item, i) => {
      return item / Math.pow(60, i);
    })
    .reduce((a, b) => a + b);
  return positiveDirection ? res : -res;
}

function transformMetaToNodeData(exifData, iptcData) {
  const gps = { longitude: null, latitude: null };

  if (exifData) {
    if (
      exifData.gps &&
      exifData.gps.GPSLongitude &&
      exifData.gps.GPSLatitude
    ) {
      gps.longitude = convertDMSToDD(
        exifData.gps.GPSLongitude,
        exifData.gps.GPSLongitudeRef === 'E'
      );
      gps.latitude = convertDMSToDD(
        exifData.gps.GPSLatitude,
        exifData.gps.GPSLatitudeRef === 'N'
      );
    }
  }
  

  return {
    exif: exifData?.exif,
    gps,
    meta: {
      dateTaken: exifData?.exif?.DateTimeOriginal
    },
    iptc: iptcData || undefined
  };
}


exports.onCreateNode = async function ({ node, getNode, actions }) {
  const { createNodeField } = actions;
  if (node.internal.type === 'ImageSharp') {
    const parent = getNode(node.parent);

    const file = await readFile(parent.absolutePath)
    const iptcData = iptc(file)
    const exifData = await read(parent.absolutePath)
    createNodeField({
      node,
      name: 'imageMeta',
      value: transformMetaToNodeData(exifData, iptcData)
    });
  }
}