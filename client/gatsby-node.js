const path = require("path");
const Vibrant = require("node-vibrant");
const chroma = require("chroma-js");
const chalk = require("chalk");
const R = require("ramda");
const exifr = require("exifr");
const sharp = require("sharp");
// const { graphql } = require("gatsby");

const badContrast = (color1, color2) => chroma.contrast(color1, color2) < 4.5;

const logColorsWithContrast = (color1, color2, text) => {
  const c1hex = color1.hex();
  const c2hex = color2.hex();
  console.log(
    chalk.hex(c1hex).bgHex(c2hex)(
      `${text} ${c1hex}/${c2hex} ${chroma.contrast(color1, color2)}`
    )
  );
};

function processColors(vibrantData, imagePath) {
  let Vibrant = chroma(vibrantData.Vibrant.getRgb());
  let DarkVibrant = chroma(vibrantData.DarkVibrant.getRgb());
  let LightVibrant = chroma(vibrantData.LightVibrant.getRgb());
  let Muted = chroma(vibrantData.Muted.getRgb());
  let DarkMuted = chroma(vibrantData.DarkMuted.getRgb());
  let LightMuted = chroma(vibrantData.LightMuted.getRgb());

  // first pass - darken bg and lighten relevant fg colors
  if (
    badContrast(DarkVibrant, Vibrant) ||
    badContrast(DarkVibrant, LightMuted)
  ) {
    DarkVibrant = DarkVibrant.darken();
    if (badContrast(DarkVibrant, Vibrant)) {
      Vibrant = Vibrant.brighten();
    }
    if (badContrast(DarkVibrant, Vibrant)) {
      Vibrant = Vibrant.brighten();
    }
  }
  // second pass - first doesn't always do enough
  if (
    badContrast(DarkVibrant, Vibrant) ||
    badContrast(DarkVibrant, LightMuted)
  ) {
    if (badContrast(DarkVibrant, Vibrant)) {
      Vibrant = Vibrant.brighten(2);
    }
    if (badContrast(DarkVibrant, LightMuted)) {
      LightMuted = LightMuted.brighten(2);
    }
  }

  // only used for hover styles, so we should give it a shot but it's not a huge deal if it's not very legible
  if (badContrast(Muted, LightMuted)) {
    Muted = Muted.darken();
  }

  if (badContrast(DarkVibrant, Vibrant)) {
    console.warn("contrast still too low", imagePath);
    logColorsWithContrast(Vibrant, DarkVibrant, "V-DV");
  }
  if (badContrast(DarkVibrant, LightMuted)) {
    console.warn("contrast still too low", imagePath);
    logColorsWithContrast(LightMuted, DarkVibrant, "LM-DV");
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

// function convertDMSToDD(dms, positiveDirection) {
//   const res = dms
//     .map((item, i) => {
//       return item / Math.pow(60, i);
//     })
//     .reduce((a, b) => a + b);
//   return positiveDirection ? res : -res;
// }

// const gps = { longitude: null, latitude: null };

// if (exifData) {
//   if (exifData.gps && exifData.gps.GPSLongitude && exifData.gps.GPSLatitude) {
//     gps.longitude = convertDMSToDD(
//       exifData.gps.GPSLongitude,
//       exifData.gps.GPSLongitudeRef === "E"
//     );
//     gps.latitude = convertDMSToDD(
//       exifData.gps.GPSLatitude,
//       exifData.gps.GPSLatitudeRef === "N"
//     );
//   }
// }

function transformMetaToNodeData(
  metaData,
  vibrantData,
  imagePath,
  { r, g, b }
) {
  const vibrant = vibrantData ? processColors(vibrantData, imagePath) : null;
  const vibrantHue = vibrantData.Vibrant.getHsl()[0] * 360;
  let dominantHue = chroma(r, g, b).hsl();
  if (isNaN(dominantHue[0])) {
    dominantHue[0] = 0;
  }
  let Keywords = metaData.Keywords;
  if (!Keywords) {
    Keywords = []
  }
  if (!Array.isArray(Keywords)) {
    Keywords = [Keywords]
  }
  return {
    dateTaken: metaData.DateTimeOriginal,
    meta: {
      ...metaData,
      Keywords,
    },
    vibrant,
    vibrantHue,
    dominantHue,
  };
}

// exports.createSchemaCustomization = function ({ actions }) {
//   const { createTypes } = actions;
//   const typedefs = `
//   type FileFieldsImageMetaMeta{
//     Keywords: [String]
//   }`;
//   createTypes(typedefs);
// };

exports.onCreateNode = async function ({ node, actions }) {
  const { createNodeField } = actions;

  if ((node.internal.type === "File" || node.internal.type === 'STRAPI__MEDIA') && node.ext === ".jpg") {
    const metaData = await exifr.parse(node.absolutePath, {
      iptc: true,
      xmp: true,
      // icc: true
    });

    const sharpImage = sharp(node.absolutePath);
    const { dominant } = await sharpImage.stats();
    const resizedImage = await sharpImage
      .resize({
        width: 3000,
        height: 3000,
        fit: "inside",
      })
      .toBuffer();

    const vibrantData = await Vibrant.from(resizedImage)
      .quality(1)
      .getPalette();

    createNodeField({
      node,
      name: "imageMeta",
      value: transformMetaToNodeData(
        metaData,
        vibrantData,
        node.absolutePath,
        dominant
      ),
    });
  }
};

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const galleryImages = await graphql(`
    {
      allFile(filter: { sourceInstanceName: { eq: "gallery" } }) {
        edges {
          node {
            relativePath
            base
            fields {
              imageMeta {
                dateTaken
              }
            }
          }
        }
      }
    }
  `);
  // Handle errors
  if (galleryImages.errors) {
    reporter.panicOnBuild("Error while running GraphQL query.");
    return;
  }
  // Create pages for each markdown file.
  const galleryImageTemplate = path.resolve(
    "src/components/GalleryImage/GalleryImage.js"
  );
  // const diffDate = (a, b) =>
  //   new Date(R.path(['node', 'childImageSharp', 'fields', 'imageMeta', 'dateTaken'], a)).getTime() - new Date(R.path(['node', 'childImageSharp', 'fields', 'imageMeta', 'dateTaken'],b)).getTime();

  const edges = R.sort(
    R.descend(
      (edge) =>
        new Date(R.path(["node", "fields", "imageMeta", "dateTaken"], edge))
    ),
    galleryImages.data.allFile.edges
  );

  edges.forEach(({ node }, index) => {
    const nextImage =
      index === edges.length - 1 ? null : edges[index + 1].node.base;
    const prevImage = index === 0 ? null : edges[index - 1].node.base;
    const page = {
      path: `photogallery/${node.base}`,
      component: galleryImageTemplate,
      context: {
        imageFilename: node.base,
        nextImage,
        prevImage,
      },
    };
    createPage(page);
  });
};
