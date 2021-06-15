import * as React from 'react';
import { graphql } from 'gatsby';
// import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Helmet } from 'react-helmet';
// import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

// import { getMeta } from '../utils';
import MasonryGallery from '../components/MasonryGallery';

const GalleryPage = ({ data }) => {
  const images = React.useMemo(() =>
    data.allFile.edges
      .map(edge => edge.node, [data])
  , [data]);

  return (<>
    <Helmet>
      <title>Gallery | Chuck Dries</title>
      <body className="bg-black text-white" />
    </Helmet>
    <div className="bg-black min-h-screen">
      <h1 className="text-2xl">Gallery</h1>
      <div className="mx-auto 2xl:container">
        <MasonryGallery
          images={images}
          itemsPerRow={{
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
            '2xl': 4,
          }}
        />
      </div>
    </div>
  </>);
};

export const query = graphql`
query GalleryPageQuery {
  allFile(filter: {
    sourceInstanceName: { eq: "gallery" }}
    sort: {order: DESC, fields: childrenImageSharp___fields___imageMeta___dateTaken}
  ) {
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
            height: 550
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

export default GalleryPage;
