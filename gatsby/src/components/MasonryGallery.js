import * as React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as R from 'ramda';
import { getAspectRatio, getName } from '../utils';
import useBreakpoint from 'use-breakpoint';

import preval from 'babel-plugin-preval/macro';
const themeBreakpoints = preval`
const R = require('ramda')
const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../../tailwind.config.js');
const {theme} = resolveConfig(tailwindConfig);
module.exports = R.map(size => parseInt(size, 10), theme.screens);
`;

const MasonryGallery = ({ images, itemsPerRow: itemsPerRowByBreakpoint }) => {
  const breakpoints = React.useMemo(() => 
    R.pick(R.keys(itemsPerRowByBreakpoint), themeBreakpoints)
  , [itemsPerRowByBreakpoint]);

  const { breakpoint } = useBreakpoint(breakpoints, 'md');

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
        const widthNumber = ((ar / rowAspectRatioSum) * 100);
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
