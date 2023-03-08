import * as React from "react";
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as R from "ramda";
import { getAspectRatio, getVibrantStyle, getName, getVibrant } from "../utils";
import useBreakpoint from "use-breakpoint";

// @ts-ignore
import themeBreakpoints from "../breakpoints";
import classNames from "classnames";
// import useDimensions from "react-cool-dimensions";
import { GalleryImage } from "../pages/photogallery";

interface Row {
  aspect: number;
  images: number;
  startIndex: number;
}

interface MasonryGalleryProps {
  images: readonly GalleryImage[];
  aspectsByBreakpoint: {
    [breakpoint: string]: number;
  };
  debugHue?: boolean;
  debugRating?: boolean;
  linkState?: object;
  showPalette?: boolean;
  singleRow?: boolean;
}

const MasonryGallery = ({
  images,
  aspectsByBreakpoint: aspectTargetsByBreakpoint,
  debugHue,
  debugRating,
  linkState,
  showPalette,
  singleRow,
}: MasonryGalleryProps) => {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  const breakpoints = React.useMemo(
    () => R.pick(R.keys(aspectTargetsByBreakpoint), themeBreakpoints),
    [aspectTargetsByBreakpoint]
  );

  // const { observe, currentBreakpoint } = useDimensions({
  //   breakpoints,
  // });

  const { breakpoint } = useBreakpoint(breakpoints, "xs");

  // const breakpoint = currentBreakpoint.length ? currentBreakpoint : "xs";
  const galleryWidth = `calc(100vw - ${
    breakpoint === "xs" || breakpoint === "sm" ? "32" : "160"
  }px)`;

  const aspectRatios = React.useMemo(
    () => R.map(getAspectRatio, images).filter(Boolean),
    [images]
  ) as number[];

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
            // no-op instead of starting a new row
            if (singleRow) {
              return [
                ...acc,
                currentRow,
              ]
            }
            // start a new row
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
    <div
      className={classNames(
        "flex items-center flex-wrap mx-auto px-4 md:px-8",
        isClient ? "" : ""
      )}
      // ref={observe}
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
        let height = `calc(${galleryWidth} / ${rowAspectRatioSum} ${showPalette ? "+ 10px" : "- 10px"})`;
        if (rowAspectRatioSum < targetAspect * 0.66) {
          // incomplete row, render stuff at "ideal" sizes instead of filling width
          width = `calc(calc(100vw - 160px) / ${targetAspect / ar})`;
          height = "unset";
        } else {
          const widthNumber = ((ar / rowAspectRatioSum) * 100).toFixed(7);
          width = `${widthNumber}%`;
        }
        const vibrant = getVibrant(image);
        // @ts-ignore
        const img = getImage(image);
        return (
          <Link
            className={classNames("border-8 border-white overflow-hidden")}
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
              borderColor: debugHue
                ? `hsl(
                    ${image.fields?.imageMeta?.dominantHue?.[0]},
                    ${image.fields?.imageMeta?.dominantHue?.[1] ?? 0 * 100}%,
                    ${image.fields?.imageMeta?.dominantHue?.[2] ?? 0 * 100}%
                  )`
                : "",
            }}
            to={`/photogallery/${image.base}/`}
          >
            {debugRating && (
              <span className="text-white z-20 absolute bg-black">
                rating: {image.fields?.imageMeta?.meta?.Rating}
              </span>
            )}
            {img && (
              <div className={`h-full ${showPalette && "grid grid-rows-[1fr_20px]"}`}>
                <GatsbyImage
                  alt={getName(image)}
                  className="w-full"
                  image={img}
                  objectFit="cover"
                />
                { showPalette && vibrant && <div className="grid grid-cols-6 flex-shrink-0 h-[20px] w-full">
                <div
                    style={{ background: `rgba(${vibrant.Vibrant?.join(",")})` }}
                  ></div>
                  <div
                    style={{
                      background: `rgb(${vibrant.LightVibrant?.join(",")})`,
                    }}
                  ></div>
                  <div
                    style={{
                      background: `rgb(${vibrant.DarkVibrant?.join(",")})`,
                    }}
                  ></div>
                  <div
                    style={{ background: `rgb(${vibrant.Muted?.join(",")})` }}
                  ></div>
                  <div
                    style={{
                      background: `rgb(${vibrant.LightMuted?.join(",")})`,
                    }}
                  ></div>
                  <div
                    style={{
                      background: `rgb(${vibrant.DarkMuted?.join(",")})`,
                    }}
                  ></div>
                </div>}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MasonryGallery;
