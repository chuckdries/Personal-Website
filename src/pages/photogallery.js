import * as React from "react";
import * as R from "ramda";
import { graphql, Link } from "gatsby";
import { navigate } from "gatsby";
import { Helmet } from "react-helmet";

import MasonryGallery from "../components/MasonryGallery";

const GalleryPage = ({ data }) => {
  const [debug, setDebug] = React.useState(false);

  const images = React.useMemo(
    () =>
      R.pipe(
        R.map((edge) => edge.node),
        debug
          ? R.sortBy(R.path(["fields", "imageMeta", "dominantHue", 0]))
          : R.sortBy(R.path(["fields", "imageMeta", "vibrantHue"]))
      )(data.allFile.edges),
    [data, debug]
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
        <div className="flex flex-col md:flex-row">
          <h1 className="text-5xl mt-0 ml-5 font-serif font-black z-10 flex-auto">
            Photo Gallery
          </h1>
          {typeof window !== "undefined" &&
          window.location.hash.includes("debug") ? (
            <div className="m-2">
              <label>
                <input
                  className="mr-1"
                  onChange={() => setDebug(!debug)}
                  type="checkbox"
                  value={debug}
                />
                [debug] use stats.dominant instead of vibrant.Vibrant
              </label>
            </div>
          ) : null}
        </div>
        <div className="mx-auto">
          <MasonryGallery
            aspectsByBreakpoint={{
              sm: 3,
              md: 4,
              lg: 4,
              xl: 5,
            }}
            debug={debug}
            images={images}
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
      sort: { fields: fields___imageMeta___vibrantHue, order: DESC }
    ) {
      edges {
        node {
          relativePath
          base
          childImageSharp {
            fluid {
              aspectRatio
            }
            gatsbyImageData(
              layout: CONSTRAINED
              height: 550
              placeholder: DOMINANT_COLOR
            )
          }
          fields {
            imageMeta {
              dominantHue
              dateTaken
              meta {
                ObjectName
              }
              vibrant {
                Vibrant
              }
            }
          }
        }
      }
    }
  }
`;

export default GalleryPage;
