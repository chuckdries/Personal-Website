const fs = require('fs');
const util = require('util');
const path = require('path');
const { read } = require('fast-exif');
const iptc = require('node-iptc');
const Vibrant = require('node-vibrant');
const chroma = require('chroma-js');
const chalk = require('chalk');

const readFile = util.promisify(fs.readFile);

const badContrast = (color1, color2) => chroma.contrast(color1, color2) < 4.5;

const logColorsWithContrast = (color1, color2, text) => {
  const c1hex = color1.hex();
  const c2hex = color2.hex();
  console.log(chalk.hex(c1hex).bgHex(c2hex)(
    `${text} ${c1hex}/${c2hex} ${chroma.contrast(color1, color2)}`
  ));
};

function processColors(vibrantData, imagePath) {
  let Vibrant = chroma(vibrantData.Vibrant.getRgb());
  let DarkVibrant = chroma(vibrantData.DarkVibrant.getRgb());
  let LightVibrant = chroma(vibrantData.LightVibrant.getRgb());
  let Muted = chroma(vibrantData.Muted.getRgb());
  let DarkMuted = chroma(vibrantData.DarkMuted.getRgb());
  let LightMuted = chroma(vibrantData.LightMuted.getRgb());

  // first pass - darken bg and lighten relevant fg colors
  if (badContrast(DarkVibrant, Vibrant) || badContrast(DarkVibrant, LightMuted)) {
    DarkVibrant = DarkVibrant.darken();
    if (badContrast(DarkVibrant, Vibrant)) {
      Vibrant = Vibrant.brighten();
    }
    if (badContrast(DarkVibrant, Vibrant)) {
      Vibrant = Vibrant.brighten();
    }
  }
  // second pass - first doesn't always do enough
  if (badContrast(DarkVibrant, Vibrant) || badContrast(DarkVibrant, LightMuted)) {
    // DarkVibrant = DarkVibrant.darken();
    if (badContrast(DarkVibrant, Vibrant)) {
      Vibrant = Vibrant.brighten(2);
    }
    if (badContrast(DarkVibrant, LightMuted)) {
      LightMuted = LightMuted.brighten(2);
    }
  }

  if (badContrast(DarkVibrant, Vibrant)){
    console.warn('contrast still too low', imagePath);
    logColorsWithContrast(Vibrant, DarkVibrant, 'V-DV');
  }
  if (badContrast(DarkVibrant, LightMuted)){
    console.warn('contrast still too low', imagePath);
    logColorsWithContrast(LightMuted, DarkVibrant, 'LM-DV');
  }


  return {
    Vibrant: Vibrant.rgb(),
    DarkVibrant: DarkVibrant.rgb(),
    LightVibrant: LightVibrant.rgb(),
    Muted: Muted.rgb(),
    DarkMuted: DarkMuted.rgb(),
    LightMuted: LightMuted.rgb(),
  };
}

function convertDMSToDD(dms, positiveDirection) {
  const res = dms
    .map((item, i) => {
      return item / Math.pow(60, i);
    })
    .reduce((a, b) => a + b);
  return positiveDirection ? res : -res;
}

function transformMetaToNodeData(exifData, iptcData, vibrantData, imagePath) {
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

  const vibrant = processColors(vibrantData, imagePath);


  return {
    exif: exifData?.exif,
    gps,
    dateTaken: exifData?.exif?.DateTimeOriginal,
    iptc: iptcData || undefined,
    vibrant,
  };
}


exports.onCreateNode = async function ({ node, getNode, actions }) {
  const { createNodeField } = actions;
  if (node.internal.type === 'ImageSharp') {
    const parent = getNode(node.parent);

    const file = await readFile(parent.absolutePath);
    const iptcData = iptc(file);
    const exifData = await read(parent.absolutePath);
    const vibrantData = await Vibrant.from(parent.absolutePath)
      .quality(2)
      .getPalette();

    createNodeField({
      node,
      name: 'imageMeta',
      value: transformMetaToNodeData(exifData, iptcData, vibrantData, parent.absolutePath),
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
  const edges = galleryImages.data.allFile.edges;

  edges.forEach(({ node }, index) => {
    const nextImage = index === edges.length - 1
      ? null
      : edges[index + 1].node.base;
    const prevImage = index === 0
      ? null
      : edges[index - 1].node.base;
    console.log('next', nextImage);

    createPage({
      path: `photogallery/${node.base}`,
      component: galleryImageTemplate,
      context: {
        imageFilename: node.base,
        nextImage,
        prevImage,
      },
    });
  });
};
