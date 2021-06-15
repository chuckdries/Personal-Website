import React from 'react';
import { graphql } from 'gatsby';
import { getMeta, getName, hasName } from '../utils';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';

const GalleryImage = ({ data }) => {
  const image = data.allFile.edges[0].node;
  const ar = image.childImageSharp.fluid.aspectRatio;
  console.log(ar);
  // const imageStyle = {}
  // if (ar > 1) {
  //   imageStyle.width = '90vw'
  // } else {
  //   imageStyle.height = '90vh'
  // }

  console.log(`calc(90vw * ${ar})px`);

  const name = getName(image);
  return (<>
    <Helmet>
      <title>{name} - Gallery | Chuck Dries</title>
      <body className="bg-black" />
    </Helmet>
    <div className="min-h-screen flex flex-col justify-center">
      {/* TODO: change layout by amount of empty space on side of page, not aspect ratio? */}
      <div style={{ margin: '0 5vw' }} className={classnames('flex mx-auto', ar > 1 ? 'flex-col' : 'flex-row-reverse')}>
        <div className='flex-grow-0'>
          <GatsbyImage
            className=""
            loading='eager'
            objectFit='contain'
            style={{
              maxWidth: `calc(max(90vh, 500px) * ${ar})`,
              // height: '90vh',
              maxHeight: '90vh',
              minHeight: '500px',
            }}
            key={image.base}
            image={getImage(image)}
            alt={name} />
        </div>
        <div className={classnames('flex-shrink-0 mr-4', ar <= 1 && 'pt-4 flex-auto text-right')}>
          {hasName(image) && <h1 className="text-2xl mt-2">{name}</h1>}
          <p>{getMeta(image).iptc.caption}</p>
          <p>some other meta</p>
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
        relativePath
        base
        childImageSharp{
          fluid {
            aspectRatio
          }
          gatsbyImageData(
            layout: CONSTRAINED
            # placeholder: BLURRED
            # placeholder: DOMINANT_COLOR
            placeholder: TRACED_SVG
            height: 2048
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
                ShutterSpeedValue
                ISO
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