import * as React from "react";
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as R from "ramda";
import { getAspectRatio, getName } from "../utils";
import useBreakpoint from "use-breakpoint";

import themeBreakpoints from "../breakpoints";

const MasonryGallery = ({
  images,
  aspectsByBreakpoint: aspectTargetsByBreakpoint,
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
    el.scrollIntoView();
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

  const rowsByBreakpoint = React.useMemo(
    () =>
      R.map(
        R.pipe(
          (targetAspect) =>
            R.reduce(
              (acc, currentAspect) => {
                const currentRow = acc.pop();
                if (currentRow.aspect + currentAspect > targetAspect) {
                  return [
                    ...acc,
                    currentRow,
                    {
                      aspect: currentAspect,
                      images: 1,
                      startIndex: currentRow.startIndex + currentRow.images,
                    },
                  ];
                }
                return [
                  ...acc,
                  {
                    aspect: currentRow.aspect + currentAspect,
                    images: currentRow.images + 1,
                    startIndex: currentRow.startIndex,
                  },
                ];
              },
              [{ aspect: 0, startIndex: 0, images: 0 }],
              aspectRatios
            ),
          R.indexBy(R.prop("startIndex"))
        )
      )(aspectTargetsByBreakpoint),
    [aspectRatios, aspectTargetsByBreakpoint]
  );

  const rows = rowsByBreakpoint[breakpoint];

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
        const widthNumber = ((ar / rowAspectRatioSum) * 100).toFixed(7);

        const width = `${widthNumber}%`;
        return (
          <Link
            className="border border-black inline-block"
            id={image.base}
            key={`${image.base}`}
            state={{ modal: true }}
            style={{
              width,
            }}
            to={`/photogallery/${image.base}`}
          >
            <GatsbyImage
              alt={getName(image)}
              className="w-full"
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
