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
  // console.log(ar);

  // TODO: layout by comparing aspect ratio of browser to aspect ratio of image
  // TODO: metadata

  // console.log(`calc(90vw * ${ar})px`);

  const name = getName(image);
  const meta = getMeta(image);
  const vibrant = getVibrant(image, true);

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
    <div className="min-h-screen flex flex-col justify-center">
      <div className={classnames('flex mx-auto', ar > 1 ? 'flex-col' : 'flex-row-reverse')} style={{ margin: '0 5vw' }}>
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
              minHeight: '500px',
            }} />
        </div>
        <div className={classnames('flex-shrink-0 mr-2 flex flex-row', ar <= 1 && 'pt-4 flex-col flex-auto text-right')}>
          <div className="flex-auto mr-1">
            {hasName(image) && <h1 className="text-2xl mt-2 font-serif">{name}</h1>}
            <p className="mr-1">{meta.iptc.caption}</p>
          </div>
          {shutterSpeed && <p className="mr-1">Shutter speed: {shutterSpeed}</p>}
          {meta.exif.FNumber && <p className="mr-1">Aperture: f/{meta.exif.FNumber}</p>}
          {meta.exif.ISO && <p className="mr-1">ISO: {meta.exif.ISO}</p>}
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
              }
              exif {
                FNumber
                ExposureTime
                ISO
              }
              vibrant {
                DarkMuted
                DarkVibrant
                LightMuted
                LightVibrant
                Muted
                Vibrant
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
