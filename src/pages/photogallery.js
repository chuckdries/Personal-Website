import * as React from "react";
import { graphql, Link } from "gatsby";
import { Helmet } from "react-helmet";

import MasonryGallery from "../components/MasonryGallery";
import GlobalNav from "../components/GlobalNav";

const GalleryPage = ({ data }) => {
  const images = React.useMemo(
    () => data.allFile.edges.map((edge) => edge.node, [data]),
    [data]
  );

  return (
    <>
      <Helmet>
        <title>Photo Gallery | Chuck Dries</title>
        <body className="bg-black text-white" />
      </Helmet>
      <GlobalNav />
      <div className="bg-black min-h-screen mx-auto">
        <h1 className="text-5xl mt-0 ml-5 font-serif font-black z-10 relative">
          Photo Gallery
        </h1>
        <div className="mx-auto">
          <MasonryGallery
            images={images}
            aspectsByBreakpoint={{
              sm: 3.6,
              md: 4,
              lg: 5,
              xl: 6.1,
            }}
          />
        </div>
      </div>
    </>
  );
};

export const query = graphql`
  query GalleryPageQuery {
    allFile(
      filter: { sourceInstanceName: { eq: "gallery" } }
      sort: { order: DESC, fields: fields___imageMeta___dateTaken }
    ) {
      edges {
        node {
          relativePath
          base
          childImageSharp {
            fluid {
              aspectRatio
            }
            gatsbyImageData(layout: CONSTRAINED, height: 550)
          }
          fields {
            imageMeta {
              dateTaken
              meta {
                ObjectName
              }
            }
          }
        }
      }
    }
  }
`;

export default GalleryPage;
