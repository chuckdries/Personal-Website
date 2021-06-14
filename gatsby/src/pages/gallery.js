import * as React from 'react'
import { graphql, Link } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { Helmet } from 'react-helmet'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import { getMeta } from '../utils'

const GalleryPage = ({ data }) => {
  const images = React.useMemo(() =>
    data.allFile.edges
      .map(edge => edge.node, [data])
      .sort((left, right) => {
        const leftDate = new Date(getMeta(left).dateTaken)
        console.log(leftDate)
        const rightDate = new Date(getMeta(right).dateTaken)
        if (leftDate < rightDate) {
          return 1;
        }
        if (leftDate > rightDate) {
          return -1;
        }
        return 0;
      }) // TODO HERE
    , [data])

  return (<>
    <Helmet>
      <title>Gallery | Chuck Dries</title>
      <body className="bg-black" />
    </Helmet>
    <div className="bg-black min-h-screen">
      <h1 className="text-2xl">Gallery</h1>
      <div className="mx-auto" style={{maxWidth: '1800px'}}>
        {/* TODO swap masonry plugin, this one makes really unbalanced columns */}
        {/* ...implement manually :sadge: */}
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 650: 2, 1200: 3 }}
      >
        <Masonry gutter='5px'>
          {images.map(image => {
            console.log('ar', image.childImageSharp)
            const name = getMeta(image).iptc.object_name || image.base
            return (
              <React.Fragment key={name}>
                <Link state={{modal: true}} to={`/gallery/${image.base}`}>
                  <GatsbyImage
                    key={image.base}
                    image={getImage(image)}
                    alt={name} />
                </Link>
              </React.Fragment>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
      </div>
    </div>
  </>)
}

export const query = graphql`
query GalleryPageQuery {
  allFile(filter: {
    sourceInstanceName: { eq: "gallery" }}) {
    edges {
      node {
      	relativePath,
        base,
        childImageSharp{
          fluid {
            aspectRatio
          },
          gatsbyImageData(
            layout: CONSTRAINED,
            width: 650
          )
          fields {
            imageMeta {
              dateTaken
              iptc {
                # caption
                object_name
              }
              # exif {
              #   FNumber
              #   ExposureTime
              #   ShutterSpeedValue
              #   ISO
              # }
            }
          }
        }
      }
    }
  }
}`;

export default GalleryPage