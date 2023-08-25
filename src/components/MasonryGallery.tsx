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
  dataFn?: (image: GalleryImage) => string[] | null;
  linkState?: object;
  showPalette?: boolean;
  singleRow?: boolean;
}

const MasonryGallery = ({
  images: _images,
  aspectsByBreakpoint: aspectTargetsByBreakpoint,
  debugHue,
  dataFn,
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

  const { breakpoint } = useBreakpoint(breakpoints, "xs");
  console.log("🚀 ~ file: MasonryGallery.tsx:51 ~ breakpoint:", breakpoint)

  const galleryWidth = `calc(100vw - ${
    breakpoint === "xs" || breakpoint === "sm" ? "32" : "160"
  }px)`;

  const aspectRatios = React.useMemo(
    () => R.map(getAspectRatio, _images).filter(Boolean),
    [_images]
  ) as number[];

  const targetAspect = aspectTargetsByBreakpoint[breakpoint];
  const rows = React.useMemo(() => {
    const _rows: Row[] = [{ aspect: 0, startIndex: 0, images: 0 }];

    for (const currentAspect of aspectRatios) {
      const currentRow = _rows[_rows.length - 1];
      const currentDiff = Math.abs(targetAspect - currentRow.aspect);
      const diffIfImageIsAddedToCurrentRow = Math.abs(
        targetAspect - (currentRow.aspect + currentAspect)
      );

      // does adding current image to our row get us closer to our target aspect ratio?
      if (currentDiff > diffIfImageIsAddedToCurrentRow) {
        currentRow.aspect += currentAspect;
        currentRow.images += 1;
        // _rows.push(currentRow);
        continue;
      }

      if (singleRow) {
        break;
      }

      // start a new row
      _rows.push({
        aspect: currentAspect,
        images: 1,
        startIndex: currentRow.startIndex + currentRow.images,
      });
    }

    return R.indexBy(R.prop("startIndex"), _rows);
  }, [aspectRatios, targetAspect, singleRow]);

  const sortedImageList = React.useMemo(
    () => _images.map((image) => image.base),
    [_images]
  );

  const images = singleRow ? _images.slice(0, rows[0].images) : _images;

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
        let width: string;
        let height = `calc(${galleryWidth} / ${rowAspectRatioSum} ${
          showPalette ? "+ 10px" : "- 10px"
        })`;
        if (rowAspectRatioSum < targetAspect * 0.66 && !singleRow) {
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

        const data = dataFn ? dataFn(image) : null;
        return (
          <Link
            className="border-8 border-white overflow-hidden relative"
            id={singleRow ? undefined : image.base}
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
            {data && (
              <div className="text-white z-20 absolute flex flex-col items-start">
                {data.map((dataString, i) => (
                  <span
                    className="bg-black/30 backdrop-blur shadow p-[2px] m-[2px] max-w-full"
                    key={i}
                  >
                    {dataString}
                  </span>
                ))}
              </div>
            )}
            {img && (
              <div
                className={`h-full ${
                  showPalette && "grid grid-rows-[1fr_20px]"
                }`}
              >
                <GatsbyImage
                  alt={
                    image.fields?.imageMeta?.meta?.Keywords?.length
                      ? `image of ${image.fields?.imageMeta?.meta?.Keywords.join(
                          " and "
                        )}. ${getName(image)}`
                      : getName(image)
                  }
                  className="w-full"
                  image={img}
                  objectFit="cover"
                  objectPosition="center top"
                />
                {showPalette && vibrant && (
                  <div className="grid grid-cols-6 flex-shrink-0 h-[20px] w-full">
                    <div
                      style={{
                        background: `rgba(${vibrant.Vibrant?.join(",")})`,
                      }}
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
                  </div>
                )}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MasonryGallery;
