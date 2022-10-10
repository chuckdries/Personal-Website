import * as React from "react";
import { Link, Node } from "gatsby";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import * as R from "ramda";
import { getAspectRatio, getName } from "../utils";
import useBreakpoint from "use-breakpoint";

// @ts-ignore
import themeBreakpoints from "../breakpoints";
import classNames from "classnames";

interface Row {
  aspect: number;
  images: number;
  startIndex: number;
}

interface MasonryGalleryProps {
  images: (ImageDataLike & Node)[];
  aspectsByBreakpoint: {
    [breakpoint: string]: number;
  }
  debugHue?: boolean;
  debugRating?: boolean;
  linkState?: object;
}

const MasonryGallery = ({
  images,
  aspectsByBreakpoint: aspectTargetsByBreakpoint,
  debugHue,
  debugRating,
  linkState,
}: MasonryGalleryProps) => {
  const breakpoints = React.useMemo(
    () => R.pick(R.keys(aspectTargetsByBreakpoint), themeBreakpoints),
    [aspectTargetsByBreakpoint]
  );

  const { breakpoint } = useBreakpoint(breakpoints, "sm");

  const aspectRatios = React.useMemo(
    () => R.map(getAspectRatio, images),
    [images]
  );

  const targetAspect = aspectTargetsByBreakpoint[breakpoint];
  const rows = React.useMemo(
    () =>
      R.pipe(
        R.reduce(
          (acc, currentAspect: number): Row[] => {
            const currentRow = acc.pop()!;
            const currentDiff = Math.abs(targetAspect - currentRow.aspect);
            const diffIfImageIsAddedToCurrentRow = Math.abs(
              targetAspect - (currentRow.aspect + currentAspect)
            );
            // add image to current row if it gets us closer to our target aspect ratio
            if (currentDiff > diffIfImageIsAddedToCurrentRow) {
              return [
                ...acc,
                {
                  aspect: currentRow.aspect + currentAspect,
                  images: currentRow.images + 1,
                  startIndex: currentRow.startIndex,
                },
              ];
            }
            return [
              ...acc,
              currentRow,
              {
                aspect: currentAspect,
                images: 1,
                startIndex: currentRow.startIndex + currentRow.images,
              } as Row,
            ];
          },
          [{ aspect: 0, startIndex: 0, images: 0 }] as Row[]
        ),
        R.indexBy(R.prop("startIndex"))
      )(aspectRatios),
    [aspectRatios, targetAspect]
  );

  const sortedImageList = React.useMemo(
    () => images.map((image) => image.base),
    [images]
  );

  let cursor = 0;
  return (
    <>
      <div
        className="flex items-center flex-wrap"
        style={{
          position: "relative",
        }}
      >
        {images.map((image, i) => {
          let currentRow = rows[cursor];
          if (rows[i]) {
            cursor = i;
            currentRow = rows[i];
          }
          const rowAspectRatioSum = currentRow.aspect;
          const ar = getAspectRatio(image);
          let width;
          let height = `calc(100vw / ${rowAspectRatioSum} - 10px)`;
          if (rowAspectRatioSum < targetAspect * 0.66) {
            // incomplete row, render stuff at "ideal" sizes instead of filling width
            width = `calc(100vw / ${targetAspect / ar})`;
            height = "unset";
          } else {
            const widthNumber = ((ar / rowAspectRatioSum) * 100).toFixed(7);
            width = `${widthNumber}%`;
          }
          const img = getImage(image);
          return (
            <Link
              className={classNames(
                "border-4 overflow-hidden",
                debugHue && "border-8"
              )}
              id={image.base}
              key={`${image.base}`}
              state={{
                ...linkState,
                sortedImageList,
                currentIndex: i,
              }}
              style={{
                height,
                width,
                // borderColor: `hsl(${image.fields.imageMeta.dominantHue}, 100%, 50%)`
                // borderColor: `rgb(${image.fields.imageMeta.vibrant.Vibrant.join(',')})`
                borderColor: debugHue
                  ? `hsl(
                    ${image.fields.imageMeta.dominantHue[0]},
                    ${image.fields.imageMeta.dominantHue[1] * 100}%,
                    ${image.fields.imageMeta.dominantHue[2] * 100}%
                  )`
                  : "black",
              }}
              to={`/photogallery/${image.base}`}
            >
              {debugHue && (
                <span className="text-white z-20 absolute bg-black">
                  hsl(
                  {image.fields.imageMeta.dominantHue[0]},{" "}
                  {(image.fields.imageMeta.dominantHue[1] * 100).toFixed(2)}%,{" "}
                  {(image.fields.imageMeta.dominantHue[2] * 100).toFixed(2)}% )
                </span>
              )}
              {debugRating && (
                <span className="text-white z-20 absolute bg-black">
                  rating: {image.fields.imageMeta.meta.Rating}
                </span>
              )}
              {img && (
                <GatsbyImage
                  alt={getName(image)}
                  className="w-full h-full"
                  image={img}
                  objectFit="cover"
                />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default MasonryGallery;
