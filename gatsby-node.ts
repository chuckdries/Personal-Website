import type { CreateSchemaCustomizationArgs, GatsbyNode } from "gatsby";

import path from "path";
import Vibrant from "node-vibrant";
import chroma, { Color } from "chroma-js";
import chalk from "chalk";
import * as R from "ramda";
import exifr from "exifr";
import sharp from "sharp";
// @ts-ignore
import { Palette } from "node-vibrant/lib/color";
import fs from "fs";
import md5 from "md5";
import { globSync } from "glob";

import util from "node:util";
import { exec as _exec } from "child_process";
const exec = util.promisify(_exec);

// const path = require("path");
// const Vibrant = require("node-vibrant");
// const chroma = require("chroma-js");
// const chalk = require("chalk");
// const R = require("ramda");
// const exifr = require("exifr");
// const sharp = require("sharp");
// const { graphql } = require("gatsby");

const hash = md5(`${new Date().getTime()}`);

const addPageDataVersion = async (file: any) => {
  const stats = await util.promisify(fs.stat)(file);
  if (stats.isFile()) {
    console.log(`Adding version to page-data.json in ${file}..`);
    let content = await util.promisify(fs.readFile)(file, "utf8");
    const result = content.replace(
      /page-data.json(\?v=[a-f0-9]{32})?/g,
      `page-data.json?v=${hash}`,
    );
    await util.promisify(fs.writeFile)(file, result, "utf8");
  }
};

export const onPostBootstrap = async () => {
  const loader = path.join(
    __dirname,
    "node_modules/gatsby/cache-dir/loader.js",
  );
  await addPageDataVersion(loader);
};

export const onPostBuild = async () => {
  const publicPath = path.join(__dirname, "public");
  const htmlAndJSFiles = globSync(`${publicPath}/**/*.{html,js}`);
  for (let file of htmlAndJSFiles) {
    await addPageDataVersion(file);
  }
};

const badContrast = (color1: Color, color2: Color) =>
  chroma.contrast(color1, color2) < 4.5;

const logColorsWithContrast = (color1: Color, color2: Color, text: string) => {
  const c1hex = color1.hex();
  const c2hex = color2.hex();
  console.log(
    chalk.hex(c1hex).bgHex(c2hex)(
      `${text} ${c1hex}/${c2hex} ${chroma.contrast(color1, color2)}`,
    ),
  );
};

function processColors(vibrantData: Palette, imagePath: string) {
  let Vibrant = chroma(vibrantData.Vibrant!.getRgb());
  let DarkVibrant = chroma(vibrantData.DarkVibrant!.getRgb());
  let LightVibrant = chroma(vibrantData.LightVibrant!.getRgb());
  let Muted = chroma(vibrantData.Muted!.getRgb());
  let DarkMuted = chroma(vibrantData.DarkMuted!.getRgb());
  let LightMuted = chroma(vibrantData.LightMuted!.getRgb());

  // // first pass - darken bg and lighten relevant fg colors
  // if (
  //   badContrast(DarkVibrant, Vibrant) ||
  //   badContrast(DarkVibrant, LightMuted)
  // ) {
  //   DarkVibrant = DarkVibrant.darken();
  // }
  // if (badContrast(DarkVibrant, Vibrant)) {
  //   Vibrant = Vibrant.brighten();
  // }
  // if (badContrast(DarkVibrant, Vibrant)) {
  //   Vibrant = Vibrant.brighten();
  // }

  // // second pass - first doesn't always do enough
  // if (badContrast(DarkVibrant, Vibrant)) {
  //   Vibrant = Vibrant.brighten(2);
  // }
  // if (badContrast(DarkVibrant, LightMuted)) {
  //   LightMuted = LightMuted.brighten(2);
  // }

  // // only used for hover styles, so we should give it a shot but it's not a huge deal if it's not very legible
  // if (badContrast(Muted, LightMuted)) {
  //   Muted = Muted.darken();
  // }

  // if (badContrast(DarkVibrant, Vibrant)) {
  //   console.warn("contrast still too low", imagePath);
  //   logColorsWithContrast(Vibrant, DarkVibrant, "V-DV");
  // }
  // if (badContrast(DarkVibrant, LightMuted)) {
  //   console.warn("contrast still too low", imagePath);
  //   logColorsWithContrast(LightMuted, DarkVibrant, "LM-DV");
  // }

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
  metaData: Record<string, unknown>,
  vibrantData: Palette,
  imagePath: string,
  { r, g, b }: { r: number; b: number; g: number },
  datePublished: string,
) {
  // const vibrant = vibrantData ? processColors(vibrantData, imagePath) : null;
  // const vibrantHue = vibrantData.Vibrant!.getHsl()[0] * 360;
  let dominantHue = chroma(r, g, b).hsl();
  if (isNaN(dominantHue[0])) {
    dominantHue[0] = 0;
  }
  let Keywords = metaData.Keywords;
  if (!Keywords) {
    Keywords = [];
  }
  if (!Array.isArray(Keywords)) {
    Keywords = [Keywords];
  }
  return {
    dateTaken: metaData.DateTimeOriginal,
    datePublished,
    meta: {
      Make: metaData.Make,
      Model: metaData.Model,
      ExposureTime: metaData.ExposureTime,
      FNumber: metaData.FNumber,
      ISO: metaData.ISO,
      DateTimeOriginal: metaData.DateTimeOriginal,
      CreateDate: metaData.CreateDate,
      ModifyDate: metaData.ModifyDate,
      ShutterSpeedValue: metaData.ShutterSpeedValue,
      ApertureValue: metaData.ApertureValue,
      FocalLength: metaData.FocalLength,
      LensModel: metaData.LensModel,
      ObjectName: metaData.ObjectName,
      Caption: metaData.Caption,
      City: metaData.City,
      State: metaData.State,
      Location: metaData.Location,
      Rating: metaData.Rating,
      Keywords,
    },
    // vibrant,
    // vibrantHue,
    // dominantHue,
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

// const MONTHS = {
//   1: "January",
//   2: "February",
//   3: "March",
//   4: "April",
//   5: "May",
//   6: "June",
//   7: "July",
//   8: "August",
//   9: "September",
//   10: "October",
//   11: "November",
//   12: "December",
// };

export const onCreateNode: GatsbyNode["onCreateNode"] = async function ({
  node,
  actions,
}) {
  const { createNodeField } = actions;

  if (node.internal.type === "File" && node.sourceInstanceName === "photos") {
    // organization data
    let exif: Awaited<ReturnType<typeof exifr.parse>>;
    try {
      exif = await exifr.parse(node.absolutePath as string);
    } catch (e) {
      console.error(
        `🅱️ something went wrong with exifr on image ${node.base}`,
        e,
      );
      throw e;
    }

    const d = new Date(exif.DateTimeOriginal);
    const month = Number(d.toLocaleString("en", { month: "numeric" }));
    const year = d.getFullYear();

    const yearFolder = year < 2021 ? "Older" : `${year}`;

    const monthSlug =
      yearFolder === "Older"
        ? `${yearFolder}`
        : `${yearFolder}/${d.toLocaleString("en", { month: "long" })}`;

    const slug = `photos/${monthSlug}/${node.base}`;
    // const slug = `photos/${node.base}`;

    createNodeField({
      node,
      name: "organization",
      value: {
        year,
        month,
        yearFolder,
        monthSlug,
        slug,
      },
    });

    // image metadata

    const { stdout: datePublished, stderr } = await exec(
      `git log --diff-filter=A --follow --format=%aI -1 -- ${node.absolutePath}`,
    );

    if (stderr.length) {
      console.error("something went wrong checking publish date: ", stderr);
    }

    let metaData;
    try {
      metaData = await exifr.parse(node.absolutePath as string, {
        iptc: true,
        xmp: true,
        // icc: true
      });
      if (!metaData.Rating) {
        // console.log(node.base, metaData);
        console.log(`${node.base} has no rating`);
      }
      if (!metaData.Keywords) {
        console.log(`${node.base} has no keywords`)
      }
    } catch (e) {
      console.error(
        `🅱️ something wen wrong with exifr on image ${node.base}`,
        e,
      );
      throw e;
    }

    let sharpImage: sharp.Sharp;

    try {
      sharpImage = sharp(node.absolutePath as string);
    } catch (e) {
      console.error(`something wen wrong with sharp on image ${node.base}`, e);
      throw e;
    }
    const { dominant } = await sharpImage.stats();
    // const resizedImage = await sharpImage
    //   .resize({
    //     width: 3000,
    //     height: 3000,
    //     fit: "inside",
    //   })
    //   .toBuffer();

    // const vibrantData = await Vibrant.from(resizedImage)
    //   // .quality(1)
    //   .getPalette();

    createNodeField({
      node,
      name: "imageMeta",
      value: transformMetaToNodeData(
        metaData,
        null, // vibrantData,
        node.absolutePath as string,
        dominant,
        // if datePublished is empty, image has not been committed to git yet and is thus brand new
        datePublished.length
          ? datePublished.replace("\n", "")
          : new Date().toDateString(),
      ),
    });
  }
};

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  const photos = await graphql<Queries.PhotosQuery>(`
    query Photos {
      allFile(filter: { sourceInstanceName: { eq: "photos" } }) {
        nodes {
          base
          id
          fields {
            organization {
              year
              yearFolder
              monthSlug
              month
              slug
            }
          }
        }
      }
    }
  `);

  // Handle errors
  if (photos.errors) {
    reporter.panicOnBuild("Error while running GraphQL query.");
    return;
  }
  // Create pages for each markdown file.
  const photoImageTemplate = path.resolve(
    "src/components/photos/PhotoImage/PhotoImage.tsx",
  );
  // const diffDate = (a, b) =>
  //   new Date(R.path(['node', 'childImageSharp', 'fields', 'imageMeta', 'dateTaken'], a)).getTime() - new Date(R.path(['node', 'childImageSharp', 'fields', 'imageMeta', 'dateTaken'],b)).getTime();

  const nodes = R.sort(
    R.descend(
      (edge) =>
        new Date(R.path(["node", "fields", "imageMeta", "dateTaken"], edge)!),
    ),
    photos.data!.allFile.nodes!,
  );

  const years: Record<string, number> = {
    Older: 1,
  };
  const months: Record<string, number> = {};

  nodes.forEach(({ base, fields, id }) => {
    if (!fields) {
      console.log("no fields", base);
      return;
    }
    const { yearFolder, monthSlug, slug } = fields.organization!;

    years[yearFolder!] = 1;
    months[monthSlug!] = 1;
    const page = {
      path: slug!,
      component: photoImageTemplate,
      context: {
        imageId: id,
      },
    };
    createPage(page);
  });

  const photoYearTemplate = path.resolve("src/components/photos/PhotoYear.tsx");

  Object.keys(years).forEach((year) => {
    createPage({
      path: `photos/${year}`,
      component: photoYearTemplate,
      context: {
        year,
      },
    });
  });

  const photoMonthTemplate = path.resolve(
    "src/components/photos/PhotoMonth.tsx",
  );

  Object.keys(months).forEach((month) => {
    createPage({
      path: `photos/${month}`,
      component: photoMonthTemplate,
      context: {
        monthSlug: month,
      },
    });
  });

  console.log("years", years);
  console.log("months", months);

  // posts
  const postsQuery = await graphql<Queries.PostsQuery>(`
    query Posts {
      allMdx {
        nodes {
          id
          frontmatter {
            slug
            date
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  if (postsQuery.errors) {
    reporter.panicOnBuild("Error loading MDX result", postsQuery.errors);
  }

  // Create blog post pages.
  const posts = postsQuery.data!.allMdx.nodes;

  const postTemplate = path.resolve(`./src/components/Posts/PostTemplate.tsx`);
  // you'll call `createPage` for each result
  posts.forEach((node) => {
    createPage({
      // As mentioned above you could also query something else like frontmatter.title above and use a helper function
      // like slugify to create a slug
      path: `/posts${node.frontmatter!.slug!}`,
      // Provide the path to the MDX content file so webpack can pick it up and transform it into JSX
      component: `${postTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id },
    });
  });
};

export const createSchemaCustomization = ({actions, schema}: CreateSchemaCustomizationArgs) => {
  const { createTypes } = actions;

 createTypes(`
   type Mdx implements Node {
     frontmatter: Frontmatter
   }

   type Frontmatter @dontInfer {
     date: Date
     slug: String
     title: String
     galleryImages: [File] @link(by: "base")
   }
 `);
}
