import "zx/globals";
// import exifr from "exifr";
import * as R from "ramda";
import { parseDate, DateFormatter } from "@internationalized/date";

const MONTH_FORMATTER = new DateFormatter("en", { month: "long" });
const YEAR_FORMATTER = new DateFormatter("en", { year: "numeric" });

const errors = [];

const files = (
  await $`exiftool -T -FileName -DateTimeOriginal data/gallery`
).stdout
  .split("\n")
  .map((line) => {
    let [filename, datetime] = line.split("\t");
    if (!datetime || !datetime.trim().length) {
      errors.push("⚠️ No datetime for file", filename);
      return false;
    }
    datetime = datetime.split(" ")[0].replace(/:/g, "-");
    const date = parseDate(datetime).toDate();
    const year= YEAR_FORMATTER.format(date)
    if (Number(year) < 2021) {
      return { filename, dir: 'Older' };
    }
    const dir = `${year}/${MONTH_FORMATTER.format(date)}`;
    return { filename, dir };
  })
  .filter(Boolean);

const dirs = R.groupBy(R.prop("dir"), files);

for (const dir in dirs) {
  if (dir === null) {
    continue;
  }
  console.log(`Creating directory: ${dir}`);
  await $`mkdir -p data/photos/${dir}`;
  for (const file of dirs[dir]) {
    console.log(`Copying file ${file.filename} to ${dir}`);
    await $`cp data/gallery/${file.filename} data/photos/${dir}`;
  }
}

console.log("Errors:");
console.log(errors.join("\n"));
