import * as React from "react";
import * as R from "ramda";
import { graphql, Link } from "gatsby";
import { Helmet } from "react-helmet";
import { Picker, Item } from "@adobe/react-spectrum";

import MasonryGallery from "../components/MasonryGallery";
import GlobalNav from "../components/GlobalNav";

const SORT_KEYS = {
  hue: ["fields", "imageMeta", "vibrantHue"],
  hue_debug: ["fields", "imageMeta", "dominantHue", 0],
  date: [],
};

const GalleryPage = ({ data }) => {
  const [sortKey, _setSortKey] = React.useState("date");
  const setSortKey = React.useCallback(
    (key) => {
      try {
        window.plausible("Sort Gallery", {
          props: { key },
        });
      } catch (e) {
        // do nothing
      }
      localStorage?.setItem("photogallery.sortkey", key);
      _setSortKey(key);
    },
    [_setSortKey]
  );

  React.useEffect(() => {
    const _sortKey = localStorage.getItem("photogallery.sortkey");
    if (_sortKey) {
      setSortKey(_sortKey);
    }
  }, [setSortKey]);

  const images = React.useMemo(
    () =>
      R.pipe(
        R.map((edge) => edge.node),
        sortKey === "date"
          ? R.sort((node1, node2) => {
              const date1 = new Date(
                R.path(["fields", "imageMeta", "dateTaken"], node1)
              );
              const date2 = new Date(
                R.path(["fields", "imageMeta", "dateTaken"], node2)
              );
              return -1 * (date1.getTime() - date2.getTime());
            })
          : R.sortBy(R.path(SORT_KEYS[sortKey]))
      )(data.allFile.edges),
    [data, sortKey]
  );

  const showDebug =
    typeof window !== "undefined" &&
    window.location.search.includes("debug=true");

  return (
    <>
      <Helmet>
        <title>Photo Gallery | Chuck Dries</title>
        <body className="bg-black text-white" />
      </Helmet>
      <div className="sticky top-0 z-10 bg-black">
        <GlobalNav />
        <div className="flex flex-row items-end">
          <h1 className="text-3xl sm:text-5xl mt-0 ml-5 font-serif font-black z-10 flex-auto">
            Photo Gallery
          </h1>
          <div className="m-2 ml-5 self-end">
            <Picker
              label="Sort by..."
              onSelectionChange={setSortKey}
              selectedKey={sortKey}
            >
              <Item key="hue">Hue</Item>
              {showDebug && <Item key="hue_debug">Dominant hue[debug]</Item>}
              <Item key="date">Date</Item>
            </Picker>
          </div>
        </div>
      </div>
      <MasonryGallery
        aspectsByBreakpoint={{
          sm: 3,
          md: 4,
          lg: 4,
          xl: 5,
          // '2xl': 6.1,
        }}
        debug={sortKey === "hue_debug"}
        images={images}
      />
    </>
  );
};

export const query = graphql`
  query GalleryPageQuery {
    allFile(filter: { sourceInstanceName: { eq: "gallery" } }) {
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
