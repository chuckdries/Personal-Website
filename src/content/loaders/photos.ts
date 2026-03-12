import type { Loader } from "astro/loaders";
import { globSync } from "glob";
import path from "path";
import exifr from "exifr";
import sharp from "sharp";
import chroma from "chroma-js";
import { execSync } from "child_process";
import {
  parseAbsoluteToLocal,
  type ZonedDateTime,
} from "@internationalized/date";

function transformDate(
  imagePath: string,
  dateTimeOriginal: string,
  offsetTimeOriginal: string,
): ZonedDateTime {
  if (!offsetTimeOriginal) {
    console.log(`${imagePath} has no timezone offset. Defaulting to UTC-8`);
  }
  const [date, time] = dateTimeOriginal.split(" ");
  const iso8601 = `${date.replace(/\:/g, "-")}T${time}${offsetTimeOriginal ?? "-08:00"}`;
  return parseAbsoluteToLocal(iso8601);
}

export function photoLoader(): Loader {
  return {
    name: "photo-loader",
    async load({ store, logger, generateDigest }) {
      const galleryDir = path.resolve("data/gallery");
      const files = globSync("**/*.{jpg,jpeg,JPG,JPEG}", {
        cwd: galleryDir,
      });

      logger.info(`Found ${files.length} photos to process`);

      for (const relativePath of files) {
        const absolutePath = path.join(galleryDir, relativePath);
        const filename = path.basename(relativePath);

        let meta: Awaited<ReturnType<typeof exifr.parse>>;
        try {
          meta = await exifr.parse(absolutePath, {
            iptc: true,
            xmp: true,
            reviveValues: false,
          });
        } catch (e) {
          logger.error(`Error parsing EXIF for ${filename}: ${e}`);
          throw e;
        }

        if (!meta?.DateTimeOriginal) {
          logger.warn(`${filename} has no DateTimeOriginal, skipping`);
          continue;
        }

        const dateTimeOriginal = transformDate(
          filename,
          meta.DateTimeOriginal,
          meta.OffsetTimeOriginal,
        );

        const month = dateTimeOriginal.month;
        const year = dateTimeOriginal.year;
        const yearFolder = year < 2021 ? "Older" : `${year}`;
        const monthName = dateTimeOriginal
          .toDate()
          .toLocaleString("en", { month: "long" });
        const monthSlug =
          yearFolder === "Older" ? `${yearFolder}` : `${yearFolder}/${monthName}`;
        const slug = `photos/${monthSlug}/${filename}`;

        // Get git publish date
        let datePublished: string;
        try {
          const stdout = execSync(
            `git log --diff-filter=A --follow --format=%aI -1 -- "${absolutePath}"`,
            { encoding: "utf-8" },
          ).trim();
          datePublished = stdout.length ? stdout : new Date().toISOString();
        } catch {
          datePublished = new Date().toISOString();
        }

        if (!meta.Rating) {
          logger.info(`${filename} has no rating`);
        }
        if (!meta.Keywords) {
          logger.info(`${filename} has no keywords`);
        }

        // Get dominant color and dimensions
        let sharpImage: sharp.Sharp;
        try {
          sharpImage = sharp(absolutePath);
        } catch (e) {
          logger.error(`Error with sharp on ${filename}: ${e}`);
          throw e;
        }
        const [stats, metadata] = await Promise.all([
          sharpImage.stats(),
          sharpImage.metadata(),
        ]);
        const { dominant } = stats;
        const width = metadata.width ?? 0;
        const height = metadata.height ?? 0;
        const dominantHue = chroma(dominant.r, dominant.g, dominant.b).hsl();
        if (isNaN(dominantHue[0])) {
          dominantHue[0] = 0;
        }

        let keywords = meta.Keywords;
        if (!keywords) {
          keywords = [];
        }
        if (!Array.isArray(keywords)) {
          keywords = [keywords];
        }

        const dominantColor = chroma(dominant.r, dominant.g, dominant.b).hex();

        const data = {
          filename,
          relativePath,
          width,
          height,
          aspectRatio: width / height,
          dominantColor,
          dateTaken: dateTimeOriginal.toDate().toISOString(),
          datePublished,
          slug,
          organization: {
            year,
            month,
            yearFolder,
            monthSlug,
          },
          meta: {
            Make: meta.Make ?? null,
            Model: meta.Model ?? null,
            ExposureTime: meta.ExposureTime ?? null,
            FNumber: meta.FNumber ?? null,
            ISO: meta.ISO ?? null,
            DateTimeOriginal: dateTimeOriginal.toDate().toISOString(),
            OffsetTimeOriginal: meta.OffsetTimeOriginal ?? null,
            FocalLength: meta.FocalLength ?? null,
            LensModel: meta.LensModel ?? null,
            ObjectName: meta.ObjectName ?? null,
            Caption: meta.Caption ?? null,
            Rating: meta.Rating ?? null,
            Keywords: keywords,
          },
        };

        store.set({
          id: filename,
          data,
          digest: generateDigest(data),
        });
      }

      logger.info(`Processed ${files.length} photos`);
    },
  };
}
