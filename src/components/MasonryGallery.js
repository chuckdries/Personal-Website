import * as React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as R from 'ramda';
import { getAspectRatio, getName } from '../utils';
import useBreakpoint from 'use-breakpoint';

import themeBreakpoints from '../breakpoints';

const MasonryGallery = ({ images, itemsPerRow: itemsPerRowByBreakpoint }) => {
  const breakpoints = React.useMemo(() => 
    R.pick(R.keys(itemsPerRowByBreakpoint), themeBreakpoints)
  , [itemsPerRowByBreakpoint]);
  console.log(breakpoints);

  const { breakpoint } = useBreakpoint(breakpoints, 'sm');

  const aspectRatios = React.useMemo(() => R.map(getAspectRatio, images), [images]);
  const rowAspectRatioSumsByBreakpoint = React.useMemo(() => R.map(R.pipe(
    R.splitEvery(R.__, aspectRatios),
    R.map(R.sum)
  ))(itemsPerRowByBreakpoint), [aspectRatios, itemsPerRowByBreakpoint]);

  const itemsPerRow = itemsPerRowByBreakpoint[breakpoint];
  const rowAspectRatioSumsForCurrentBP = rowAspectRatioSumsByBreakpoint[breakpoint];
  
  return (
    <div
      className="w-full"
      style={{
        position: 'relative',
      }}
      // style={{ maxWidth: minWidth }}
    >
      {images.map((image, i) => {
        const rowIndex = Math.floor(i / itemsPerRow);
        const rowAspectRatioSum = rowAspectRatioSumsForCurrentBP[rowIndex];
        // const width = ((getAspectRatio(image) / rowAspectRatioSum) * 100).toFixed(10);
        const ar = getAspectRatio(image);
        const widthNumber = ((ar / rowAspectRatioSum) * 100).toFixed(5);
        const width = `${widthNumber}%`;
        // const width = `${widthNumber}%`;
        // console.log('ars', rowAspectRatioSum);
        if (i === 0) {
          // console.log(rowIndex, rowAspectRatioSum);
          // console.log(getName(image), width);
        }
        return (
          <Link 
            className="inline-block"
            key={`${image.base}`}
            state={{modal: true}}
            style={{
              width,
              // marginLeft: '8px',
            }} to={`/photogallery/${image.base}`}
          >
            <GatsbyImage
              alt={getName(image)}
              className="w-full"
              // style={{ width }}
              image={getImage(image)}
              objectFit="cover"
            />
          </Link>
        );
      })}
    </div>);
  // return null;
};

export default MasonryGallery;