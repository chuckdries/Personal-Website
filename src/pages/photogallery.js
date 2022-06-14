import * as React from "react";
import { graphql, Link } from "gatsby";
import { navigate } from "gatsby";
import { Helmet } from "react-helmet";

import MasonryGallery from "../components/MasonryGallery";

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
      <nav className="mt-1 ml-1 text-lg mb-4">
        <button
          className="hover:underline text-vibrant-light hover:text-muted-light arrow-left-before  mr-1"
          onClick={() => navigate(-1)}
          type="button"
        >
          back
        </button>
        <Link
          className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
          to="/"
        >
          home
        </Link>
        <Link
          className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
          to="/photogallery/"
        >
          gallery
        </Link>
      </nav>
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
              meta{
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
