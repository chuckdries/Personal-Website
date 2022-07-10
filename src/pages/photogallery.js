import * as React from "react";
import * as R from "ramda";
import { graphql, Link } from "gatsby";
import { navigate } from "gatsby";
import { Helmet } from "react-helmet";
import { Picker, Item } from "@adobe/react-spectrum";

import MasonryGallery from "../components/MasonryGallery";
import KeywordsPicker from "../components/KeywordsPicker";
import { useQueryParamString } from "react-use-query-param-string";

const SORT_KEYS = {
  hue: ["fields", "imageMeta", "vibrantHue"],
  rating: ["fields", "imageMeta", "meta", "Rating"],
  hue_debug: ["fields", "imageMeta", "dominantHue", 0],
  date: [],
};

const GalleryPage = ({ data }) => {
  const [keyword, _setKeyword] = useQueryParamString("filter", null);
  const [sortKey, _setSortKey] = useQueryParamString("sort", "rating");
  const [showDebug, _setShowDebug] = useQueryParamString("debug", false);

  const setKeyword = React.useCallback(
    (keyword) => {
      try {
        window.plausible("Filter Keyword", {
          props: { keyword },
        });
      } catch (e) {
        // do nothing
      }
      _setKeyword(keyword);
    },
    [_setKeyword]
  );

  const setSortKey = React.useCallback(
    (key) => {
      try {
        window.plausible("Sort Gallery", {
          props: { key },
        });
      } catch (e) {
        // do nothing
      }
      localStorage?.setItem("photogallery.sortkey2", key);
      _setSortKey(key);
    },
    [_setSortKey]
  );

  React.useEffect(() => {
    const _sortKey = localStorage.getItem("photogallery.sortkey2");
    if (_sortKey) {
      setSortKey(_sortKey);
    }
  }, [setSortKey]);

  const images = React.useMemo(
    () =>
      R.pipe(
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
          : R.sort(R.descend(R.path(SORT_KEYS[sortKey]))),
        keyword
          ? R.filter((image) =>
              R.includes(
                keyword,
                R.path(["fields", "imageMeta", "meta", "Keywords"], image)
              )
            )
          : R.identity
      )(data.allFile.nodes),
    [data, sortKey, keyword]
  );

  return (
    <>
      <Helmet>
        <title>Photo Gallery | Chuck Dries</title>
        <body className="bg-black text-white" />
      </Helmet>
      <div className="sm:sticky top-0 z-10 bg-black">
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
        <div className="flex flex-col md:flex-row md:items-end">
          <h1 className="text-5xl mt-0 ml-5 mr-5 font-serif font-black z-10 flex-auto">
            Photo Gallery
          </h1>
          <KeywordsPicker
            keywords={[
              "night",
              "coast",
              "city",
              "landscape",
              "flowers",
              "product",
              "waterfall",
              "fireworks",
              "panoramic",
              "Portland Japanese Garden",
              // "sunset",
            ]}
            onChange={setKeyword}
            value={keyword}
          />
          <div className="m-2">
            <Picker
              label="Sort by..."
              onSelectionChange={setSortKey}
              selectedKey={sortKey}
            >
              <Item key="rating">Default</Item>
              <Item key="date">Date</Item>
              <Item key="hue">Hue</Item>
              {showDebug && <Item key="hue_debug">Dominant hue[debug]</Item>}
            </Picker>
          </div>
        </div>
      </div>
      <MasonryGallery
        aspectsByBreakpoint={{
          xs: 2,
          sm: 3,
          md: 4,
          lg: 4,
          xl: 5,
          // '2xl': 6.1,
        }}
        debugHue={sortKey === "hue_debug"}
        debugRating={sortKey === "rating" && showDebug}
        images={images}
      />
    </>
  );
};

export const query = graphql`
  query GalleryPageQuery {
    allFile(
      filter: { sourceInstanceName: { eq: "gallery" } }
      sort: { fields: fields___imageMeta___dateTaken, order: DESC }
    ) {
      nodes {
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
            vibrantHue
            dominantHue
            dateTaken
            meta {
              Keywords
              Rating
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
`;

export default GalleryPage;
