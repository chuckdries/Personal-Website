import * as React from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';
import { Helmet } from 'react-helmet';

import MasonryGallery from '../components/MasonryGallery';

// TODO: caption and title more images
// TODO: more images

const GalleryPage = ({ data }) => {
  const images = React.useMemo(() =>
    data.allFile.edges
      .map(edge => edge.node, [data])
  , [data]);

  return (<>
    <Helmet>
      <title>Photo Gallery | Chuck Dries</title>
      <body className="bg-black text-white" />
    </Helmet>
    <div className="bg-black min-h-screen 2xl:container">
      <Link className="hover:underline hover:text-blue-200 text-blue-300 arrow-left-before" to="/">home</Link>
      <h1 className="text-5xl mt-3 ml-5 font-serif font-black z-10 relative">Photo Gallery</h1>
      <div className="mx-auto">
        <MasonryGallery
          images={images}
          itemsPerRow={{
            sm: 2,
            md: 2,
            lg: 3,
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