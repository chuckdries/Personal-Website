import React from 'react';
import { graphql, Link } from 'gatsby';
import {
  getAspectRatio,
  getMeta,
  getName,
  getShutterFractionFromExposureTime,
  getVibrant,
  getVibrantToHelmetSafeBodyStyle,
  hasName,
} from '../utils';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';

const GalleryImage = ({ data }) => {
  const image = data.allFile.edges[0].node;
  const ar = getAspectRatio(image);

  // TODO: metadata icons

  const name = getName(image);
  const meta = getMeta(image);
  let locationString;
  if (meta.iptc.city || meta.iptc.province_or_state) {
    const location = [meta.iptc.city, meta.iptc.province_or_state].filter(Boolean);
    locationString = location.join(', ');
  }
  const vibrant = getVibrant(image, true);

  const orientationClasses = ar > 1 ? 'flex-col mx-auto' : 'portrait:mx-auto landscape:mx-5 landscape:flex-row-reverse portrait:flex-col';
  console.log(ar, orientationClasses);
  const shutterSpeed = React.useMemo(() => getShutterFractionFromExposureTime(meta.exif.ExposureTime || 0), [meta]);
  return (<>
    <Helmet>
      <title>{name} - Gallery | Chuck Dries</title>
      <body
        className="text-vibrant-light bg-vibrant-dark"
        style={getVibrantToHelmetSafeBodyStyle(vibrant)}
      />
    </Helmet>
    <Link className="hover:underline text-vibrant-light hover:text-muted-light arrow-left-before absolute" to="/photogallery">gallery</Link>
    <div className="min-h-screen pt-5 flex flex-col justify-center">
      <div className={classnames('flex', orientationClasses)}>
        <div className="flex-grow-0">
          <GatsbyImage
            alt={name}
            className=""
            image={getImage(image)}
            key={image.base}
            loading="eager"
            objectFit="contain"
            style={{
              maxWidth: `calc(max(90vh, 500px) * ${ar})`,
              maxHeight: '90vh',
              // minHeight: '500px',
            }} />
        </div>
        <div className={classnames('flex-shrink-0 mx-2 flex flex-row', ar <= 1 && 'pt-5 flex-col flex-auto text-right')}>
          <div className="flex-auto mr-2">
            {hasName(image) && <h1 className="text-2xl mt-3 font-serif">{name}</h1>}
            <p className="mr-2">{meta.iptc.caption}</p>
          </div>
          {(locationString) && <div className={classnames('flex items-baseline ml-2 text-lg', ar <= 1 && 'flex-row-reverse')}>
            <span className="relative mr-1" style={{top: '2px'}}>
              <ion-icon name="location-sharp"></ion-icon>
            </span>
            <span className="mr-1">{locationString}</span>
          </div>}
          {shutterSpeed && <div className={classnames('flex items-baseline ml-2 text-lg', ar <= 1 && 'flex-row-reverse')}>
            <span className="relative mr-1" style={{top: '2px'}}><ion-icon name="stopwatch-sharp"></ion-icon></span>
            <span className="mr-1">{shutterSpeed}</span>
          </div>}
          {meta.exif.FNumber && <div className={classnames('flex items-baseline ml-2 text-lg', ar <= 1 && 'flex-row-reverse')}>
            <span className="relative mr-1" style={{top: '2px'}}>
              <ion-icon name="aperture-sharp"></ion-icon>
            </span>
            <span className="mr-1">f/{meta.exif.FNumber}</span>
          </div>}
          {meta.exif.ISO && <div className="align-baseline ml-2 text-lg">
            <span className="font-mono" style={{fontSize: '12px'}}>ISO</span>
            <span className="mx-1">{meta.exif.ISO}</span>
          </div>}
        </div>
      </div>
    </div>
  </>);
};

export const query = graphql`
  query GalleryImage($imageFilename: String) {
  allFile(filter: {sourceInstanceName: {eq: "gallery"}, base: {eq: $imageFilename}}) {
    edges {
      node {
        base
        childImageSharp{
          fluid {
            aspectRatio
          }
          gatsbyImageData(
            layout: CONSTRAINED
            # placeholder: BLURRED
            placeholder: DOMINANT_COLOR
            # placeholder: TRACED_SVG
            height: 2160
          )
          fields {
            imageMeta {
              dateTaken
              iptc {
                caption
                object_name
                keywords
                city
                province_or_state
              }
              exif {
                FNumber
                ExposureTime
                ISO
              }
              vibrant {
                ...VibrantColors
              }
            }
          }
        }
      }
    }
  }
}


`;

export default GalleryImage;
