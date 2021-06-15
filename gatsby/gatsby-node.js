const fs = require('fs');
const util = require('util');
const path = require('path');
const { read } = require('fast-exif');
const iptc = require('node-iptc');

const readFile = util.promisify(fs.readFile);


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
    dateTaken: exifData?.exif?.DateTimeOriginal,
    iptc: iptcData || undefined
  };
}


exports.onCreateNode = async function ({ node, getNode, actions }) {
  const { createNodeField } = actions;
  if (node.internal.type === 'ImageSharp') {
    const parent = getNode(node.parent);

    const file = await readFile(parent.absolutePath);
    const iptcData = iptc(file);
    const exifData = await read(parent.absolutePath);
    createNodeField({
      node,
      name: 'imageMeta',
      value: transformMetaToNodeData(exifData, iptcData)
    });
  }
};

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  // get all images
  const galleryImages = await graphql(`
      {
        allFile(filter: {
          sourceInstanceName: { eq: "gallery" }}
        ) {
          edges {
            node {
              relativePath,
              base
            }
          }
        }
      }
    `);
  // Handle errors
  if (galleryImages.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.');
    return;
  }
  // Create pages for each markdown file.
  const galleryImageTemplate = path.resolve('src/components/GalleryImage.js');
  galleryImages.data.allFile.edges.forEach(({ node }) => {
    // const path = node.base
    createPage({
      path: `photogallery/${node.base}`,
      component: galleryImageTemplate,
      // In your blog post template's graphql query, you can use pagePath
      // as a GraphQL variable to query for data from the markdown file.
      context: {
        imageFilename: node.base,
      },
    });
  });
};
