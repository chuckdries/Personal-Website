import * as React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as R from 'ramda';
import { getAspectRatio, getName } from '../utils';
// TODO: use resolveCOnfig to not need to define screens in theme file
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';
import useBreakpoint from 'use-breakpoint';

const {theme: {screens}} = resolveConfig(tailwindConfig);
const themeBreakpoints = R.map(size => parseInt(size, 10), screens);
console.log(themeBreakpoints);

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

  // console.log('bp', breakpoint);
  const rowAspectRatioSumsForCurrentBP = rowAspectRatioSumsByBreakpoint[breakpoint];
  console.log('rowAspectRatioSumsForCurrentBP :', rowAspectRatioSumsForCurrentBP);
  
  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
      }}
      // className='mx-auto'
      // style={{ maxWidth: minWidth }}
    >
      {images.map((image, i) => {
        const rowIndex = Math.floor(i / itemsPerRowByBreakpoint[breakpoint]);
        const rowAspectRatioSum = rowAspectRatioSumsForCurrentBP[rowIndex];
        // console.log('ars', rowAspectRatioSum);
        if (i === 0) {
          console.log(rowIndex, rowAspectRatioSum);
          console.log(getName(image), `${(getAspectRatio(image) / rowAspectRatioSum) * 100}%`);
        }
        return (
          // <Link className='inline-block' key={image.base} state={{modal: true}} to={`/photogallery/${image.base}`}>
          <GatsbyImage
            key={`${image.base}-img`}
            className='inline-block'
            style={{
              width: `${(getAspectRatio(image) / rowAspectRatioSum) * 100}%`,
            }}
            // objectFit='contain'
            image={getImage(image)}
            alt={getName(image)}
          />
          // </Link>
        );
      })}
    </div>);
  // return null;
};

export default MasonryGallery;
