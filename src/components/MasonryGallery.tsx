import * as React from "react";
import * as R from "ramda";
import useBreakpoint from "use-breakpoint";
import themeBreakpoints from "../breakpoints";
import classNames from "classnames";
import type { MasonryPhotoData } from "../types";

interface Row {
  aspect: number;
  images: number;
  startIndex: number;
}

interface MasonryGalleryProps {
  images: MasonryPhotoData[];
  aspectsByBreakpoint: {
    [breakpoint: string]: number;
  };
  debugHue?: boolean;
  dataFn?: (image: MasonryPhotoData) => string[] | null;
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

  const galleryWidth = `calc(100vw - ${
    breakpoint === "xs" || breakpoint === "sm" ? "32" : "160"
  }px)`;

  const aspectRatios = React.useMemo(
    () => _images.map((img) => img.aspectRatio).filter(Boolean),
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

      if (currentDiff > diffIfImageIsAddedToCurrentRow) {
        currentRow.aspect += currentAspect;
        currentRow.images += 1;
        continue;
      }

      if (singleRow) {
        break;
      }

      _rows.push({
        aspect: currentAspect,
        images: 1,
        startIndex: currentRow.startIndex + currentRow.images,
      });
    }

    return R.indexBy(R.prop("startIndex"), _rows);
  }, [aspectRatios, targetAspect, singleRow]);

  const sortedImageList = React.useMemo(
    () => _images.map((image) => image.filename),
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
        const ar = image.aspectRatio;
        let width: string;
        let height = `calc(${galleryWidth} / ${rowAspectRatioSum} ${
          showPalette ? "+ 10px" : "- 10px"
        })`;
        if (rowAspectRatioSum < targetAspect * 0.66 && !singleRow) {
          width = `calc(calc(100vw - 160px) / ${targetAspect / ar})`;
          height = "unset";
        } else {
          const widthNumber = ((ar / rowAspectRatioSum) * 100).toFixed(7);
          width = `${widthNumber}%`;
        }

        const data = dataFn ? dataFn(image) : null;
        return (
          <a
            className="border-8 border-white overflow-hidden relative"
            id={singleRow ? undefined : image.filename}
            key={image.filename}
            href={`/${image.slug}`}
            style={{
              height,
              width,
            }}
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
            <div className="h-full">
              <img
                alt={
                  image.meta.Keywords?.length
                    ? `image of ${image.meta.Keywords.join(" and ")}. ${image.meta.ObjectName ?? image.filename}`
                    : (image.meta.ObjectName ?? image.filename)
                }
                className="w-full h-full object-cover"
                loading="lazy"
                src={image.src}
                style={{ backgroundColor: image.dominantColor }}
              />
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default MasonryGallery;
