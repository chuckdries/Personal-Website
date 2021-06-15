import * as React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as R from 'ramda';
import { getAspectRatio, getName } from '../utils';
// TODO: use resolveCOnfig to not need to define screens in theme file
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';
import useBreakpoint from 'use-breakpoint';

const {theme} = resolveConfig(tailwindConfig);
const themeBreakpoints = R.map(size => parseInt(size, 10), theme.screens);
console.log(theme);

const MasonryGallery = ({ images, itemsPerRow: itemsPerRowByBreakpoint }) => {
  const breakpoints = React.useMemo(() => 
    R.pick(R.keys(itemsPerRowByBreakpoint), themeBreakpoints)
  , [itemsPerRowByBreakpoint]);

  const { breakpoint, maxWidth, minWidth } = useBreakpoint(breakpoints, 'md');

  const aspectRatios = React.useMemo(() => R.map(getAspectRatio, images), [images]);
  const rowAspectRatioSumsByBreakpoint = React.useMemo(() => R.map(R.pipe(
    R.splitEvery(R.__, aspectRatios),
    R.map(R.sum)
  ))(itemsPerRowByBreakpoint), [aspectRatios, itemsPerRowByBreakpoint]);

  const itemsPerRow = itemsPerRowByBreakpoint[breakpoint];
  const rowAspectRatioSumsForCurrentBP = rowAspectRatioSumsByBreakpoint[breakpoint];
  
  return (
    <div
      className='w-full'
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
        const gutterReserve = parseInt(theme.spacing['1'], 10) * (itemsPerRow - 1);
        const width = `${widthNumber}%`;
        // const width = `${widthNumber}%`;
        // console.log('ars', rowAspectRatioSum);
        if (i === 0) {
          // console.log(rowIndex, rowAspectRatioSum);
          console.log(getName(image), width);
        }
        return (
          <Link 
            key={`${image.base}`}
            className='inline-block'
            style={{
              width,
              // marginLeft: '8px',
            }}
            state={{modal: true}} to={`/photogallery/${image.base}`}
          >
            <GatsbyImage
              className='w-full'
              objectFit='cover'
              // style={{ width }}
              image={getImage(image)}
              alt={getName(image)}
            />
          </Link>
        );
      })}
    </div>);
  // return null;
};

export default MasonryGallery;
