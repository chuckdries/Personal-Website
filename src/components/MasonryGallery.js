import React, { useEffect, useRef, useState } from "react";
// import { Link } from "gatsby";
import Link from 'gatsby-plugin-transition-link';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import * as R from "ramda";
import { getAspectRatio, getName } from "../utils";
import { useScroll } from "../hooks";
import useBreakpoint from "use-breakpoint";

import themeBreakpoints from "../breakpoints";

const GalleryTile = ({ image, width }) => {
  const ref = useRef();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // const x = useScroll();
  // useEffect(() => {
  //   if (ref.current && window) {
  //     const boundingClient = ref.current.getBoundingClientRect();
  //     setPosition({
  //       x: boundingClient.x,
  //       y: boundingClient.y,
  //     });
  //   }
  // }, [ref, setPosition, x]);
  return (
    <Link
      className="inline-block"
      ref={ref}
      style={{
        width,
      }}
      to={`/photogallery/${image.base}`}
      exit={{
        trigger: ({node, e, exit, entry}) => {
          // CQ: get bounding rect of current image and store in a context
        }
      }}
    >
      <div className="z-50 absolute x-[0] y-[0] font-bold text-white">
        {position.x},{position.y}
      </div>
      <GatsbyImage
        alt={getName(image)}
        className="w-full"
        image={getImage(image)}
        objectFit="cover"
      />
    </Link>
  );
};

const MasonryGallery = ({ images, itemsPerRow: itemsPerRowByBreakpoint }) => {
  const breakpoints = React.useMemo(
    () => R.pick(R.keys(itemsPerRowByBreakpoint), themeBreakpoints),
    [itemsPerRowByBreakpoint]
  );

  const { breakpoint } = useBreakpoint(breakpoints, "sm");

  const aspectRatios = React.useMemo(
    () => R.map(getAspectRatio, images),
    [images]
  );
  const rowAspectRatioSumsByBreakpoint = React.useMemo(
    () =>
      R.map(R.pipe(R.splitEvery(R.__, aspectRatios), R.map(R.sum)))(
        itemsPerRowByBreakpoint
      ),
    [aspectRatios, itemsPerRowByBreakpoint]
  );

  const itemsPerRow = itemsPerRowByBreakpoint[breakpoint];
  const rowAspectRatioSumsForCurrentBP =
    rowAspectRatioSumsByBreakpoint[breakpoint];

  return (
    <div
      className="w-full"
      style={{
        position: "relative",
      }}
      // style={{ maxWidth: minWidth }}
    >
      {images.map((image, i) => {
        const rowIndex = Math.floor(i / itemsPerRow);
        const rowAspectRatioSum = rowAspectRatioSumsForCurrentBP[rowIndex];
        // const width = ((getAspectRatio(image) / rowAspectRatioSum) * 100).toFixed(10);
        const ar = getAspectRatio(image);
        const widthNumber =
          rowAspectRatioSum === ar
            ? // image is only one in row
              100 / itemsPerRow
            : // image is one of several in row
              ((ar / rowAspectRatioSum) * 100).toFixed(7);

        const width = `${widthNumber}%`;
        return <GalleryTile key={image.base} image={image} width={width} />;
      })}
    </div>
  );
  // return null;
};

export default MasonryGallery;
