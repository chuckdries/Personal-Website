import * as React from "react";
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as R from "ramda";
import { getAspectRatio, getName } from "../utils";
import useBreakpoint from "use-breakpoint";

import themeBreakpoints from "../breakpoints";
import classNames from "classnames";

const MasonryGallery = ({
  images,
  aspectsByBreakpoint: aspectTargetsByBreakpoint,
  debug,
}) => {
  const breakpoints = React.useMemo(
    () => R.pick(R.keys(aspectTargetsByBreakpoint), themeBreakpoints),
    [aspectTargetsByBreakpoint]
  );

  const { breakpoint } = useBreakpoint(breakpoints, "sm");

  const scrollIntoView = React.useCallback(() => {
    if (!window.location.hash) {
      return;
    }
    const el = document.getElementById(window.location.hash.split("#")[1]);
    if (!el) {
      return;
    }
    el.scrollIntoView({
      block: "center",
    });
  }, []);

  React.useEffect(() => {
    // hacky but it works for now
    setTimeout(() => {
      scrollIntoView();
    }, 100);
  }, [scrollIntoView]);

  const aspectRatios = React.useMemo(
    () => R.map(getAspectRatio, images),
    [images]
  );

  const targetAspect = aspectTargetsByBreakpoint[breakpoint];
  const rows = React.useMemo(
    () =>
      R.pipe(
        R.reduce(
          (acc, currentAspect) => {
            const currentRow = acc.pop();
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
              },
            ];
          },
          [{ aspect: 0, startIndex: 0, images: 0 }]
        ),
        R.indexBy(R.prop("startIndex"))
      )(aspectRatios),
    [aspectRatios, targetAspect]
  );

  let cursor = 0;
  return (
    <div
      className="w-full flex items-center flex-wrap"
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
        if (rowAspectRatioSum < targetAspect / 2) {
          // incomplete row, render stuff at "ideal" sizes instead of filling width
          width = `calc(100vw / ${targetAspect / ar})`;
          height = "unset";
        } else {
          const widthNumber = ((ar / rowAspectRatioSum) * 100).toFixed(7);
          width = `${widthNumber}%`;
        }
        return (
          <Link
            className={classNames(
              "border-4 overflow-hidden",
              debug && "border-8"
            )}
            id={image.base}
            key={`${image.base}`}
            state={{ modal: true }}
            style={{
              height,
              width,
              // borderColor: `hsl(${image.fields.imageMeta.dominantHue}, 100%, 50%)`
              // borderColor: `rgb(${image.fields.imageMeta.vibrant.Vibrant.join(',')})`
              borderColor: debug
                ? `hsl(
                    ${image.fields.imageMeta.dominantHue[0]},
                    ${image.fields.imageMeta.dominantHue[1] * 100}%,
                    ${image.fields.imageMeta.dominantHue[2] * 100}%
                  )`
                : "black",
            }}
            to={`/photogallery/${image.base}`}
          >
            {debug && (
              <span className="text-white z-20 absolute bg-black">
                hsl(
                {image.fields.imageMeta.dominantHue[0]},{" "}
                {(image.fields.imageMeta.dominantHue[1] * 100).toFixed(2)}%,{" "}
                {(image.fields.imageMeta.dominantHue[2] * 100).toFixed(2)}% )
              </span>
            )}
            <GatsbyImage
              alt={getName(image)}
              className="w-full h-full"
              image={getImage(image)}
              objectFit="cover"
            />
          </Link>
        );
      })}
    </div>
  );
  // return null;
};

export default MasonryGallery;
