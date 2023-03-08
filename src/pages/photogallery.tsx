import * as React from "react";
import * as R from "ramda";
import { graphql, PageProps } from "gatsby";
import { Helmet } from "react-helmet";
// import { Picker, Item } from "@adobe/react-spectrum";

import MasonryGallery from "../components/MasonryGallery";
import KeywordsPicker from "../components/KeywordsPicker";
import {
  compareDates,
  getGalleryPageUrl,
  getHelmetSafeBodyStyle,
  getVibrantStyle,
} from "../utils";
import Nav from "../components/Nav";
import { Item, Select } from "../components/Select";
import { Switch } from "../components/Switch";
import ColorPalette from "@spectrum-icons/workflow/ColorPalette";

const SORT_KEYS = {
  hue: ["fields", "imageMeta", "vibrantHue"],
  rating: ["fields", "imageMeta", "meta", "Rating"],
  // hue_debug: ["fields", "imageMeta", "dominantHue", 0],
  hue_debug: ["fields", "imageMeta", "dominantHue", "0"],
  date: ["fields", "imageMeta", "dateTaken"],
  modified: ["fields", "imageMeta", "datePublished"],
} as const;

export type GalleryImage =
  Queries.GalleryPageQueryQuery["all"]["nodes"][number];

function smartCompareDates(key: keyof typeof SORT_KEYS, left: GalleryImage, right: GalleryImage) {
  let diff = compareDates(SORT_KEYS[key], left, right);
  console.log("🚀 ~ file: photogallery.tsx:34 ~ smartCompareDates ~ diff:", diff)
  if (diff !== 0) {
    return diff;
  }
  console.log('falling back to date')
  return compareDates(SORT_KEYS.date, left, right);
}

const GalleryPage = ({ data }: PageProps<Queries.GalleryPageQueryQuery>) => {
  const hash =
    typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";

  const [hashCleared, setHashCleared] = React.useState(false); // eslint-disable-line no-unused-vars
  //     ^ used just to force a re-render with the cleared hash value (I know, it's a smell for sure)
  const [filterKeyword, _setKeyword] = React.useState(null as string | null);
  const [sortKey, _setSortKey] = React.useState("rating" as string);
  const showDebug =
    typeof window !== "undefined" &&
    window.location.search.includes("debug=true");
  const [showPalette, setShowPalette] = React.useState(false);

  const setKeyword = React.useCallback(
    (newKeyword: string | null) => {
      if (newKeyword) {
        try {
          window.plausible("Filter Keyword", {
            props: { keyword: newKeyword },
          });
        } catch (e) {
          // do nothing
        }
      }
      _setKeyword(newKeyword);
      window.history.replaceState(
        null,
        "",
        getGalleryPageUrl({ keyword: newKeyword, sortKey }, hash)
      );
    },
    [_setKeyword, sortKey, hash]
  );

  const setSortKey = React.useCallback(
    (newSortKey: string) => {
      try {
        window.plausible("Sort Gallery", {
          props: { key: newSortKey },
        });
      } catch (e) {
        // do nothing
      }
      _setSortKey(newSortKey);
      window.history.replaceState(
        null,
        "",
        getGalleryPageUrl({ sortKey: newSortKey, keyword: filterKeyword }, hash)
      );
    },
    [_setSortKey, filterKeyword, hash]
  );

  const removeHash = React.useCallback(() => {
    const url = new URL(
      typeof window !== "undefined"
        ? window.location.href.toString()
        : "https://chuckdries.com/photogallery/"
    );

    url.hash = "";
    window.history.replaceState(null, "", url.href.toString());
    window.removeEventListener("wheel", removeHash);
    setHashCleared(true);
  }, []);

  const scrollIntoView = React.useCallback(() => {
    if (!hash) {
      return;
    }
    const el = document.getElementById(hash);
    if (!el) {
      return;
    }
    el.scrollIntoView({
      block: "center",
    });
    window.addEventListener("wheel", removeHash);
  }, [hash, removeHash]);

  React.useEffect(() => {
    const url = new URL(window.location.toString());

    const sortKeyFromUrl = url.searchParams.get("sort");
    if (sortKeyFromUrl) {
      _setSortKey(sortKeyFromUrl);
    }

    const filterKeyFromUrl = url.searchParams.get("filter");
    if (filterKeyFromUrl) {
      _setKeyword(filterKeyFromUrl);
    }

    // hacky but it works for now
    setTimeout(() => {
      // don't scroll into view if user got here with back button
      scrollIntoView();
    }, 100);
  }, [setSortKey, setKeyword, scrollIntoView]);

  const images: GalleryImage[] = React.useMemo(() => {
    const sort =
      sortKey === "date" || sortKey === "modified"
        ? R.sort((node1: typeof data["all"]["nodes"][number], node2) => smartCompareDates(sortKey, node1, node2))
        : R.sort(
            // @ts-ignore
            R.descend(R.path<GalleryImage>(SORT_KEYS[sortKey]))
          );

    const filter = filterKeyword
      ? R.filter((image) =>
          R.includes(
            filterKeyword,
            R.pathOr([], ["fields", "imageMeta", "meta", "Keywords"], image)
          )
        )
      : R.identity;

    try {
      const ret = R.pipe(
        // @ts-ignore
        sort,
        filter
      )(data.all.nodes) as any;
      return ret;
    } catch (e) {
      console.log("caught images!", e);
      return [];
    }
  }, [data, sortKey, filterKeyword]);

  const recents = React.useMemo(() => {
    return R.sort((left, right) => smartCompareDates('modified', left, right), data.recents.nodes)
  }, [data, 'hi'])

  return (
    <>
      {/* @ts-ignore */}
      <Helmet>
        <title>Photo Gallery | Chuck Dries</title>
        <body
          className="bg-white transition-color"
          // @ts-ignore
          style={getHelmetSafeBodyStyle(
            // @ts-ignore shrug
            getVibrantStyle({
              Muted: [0, 0, 0],
              LightMuted: [0, 0, 0],
              Vibrant: [0, 0, 0],
              LightVibrant: [0, 0, 0],
              DarkMuted: [238, 238, 238],
              DarkVibrant: [238, 238, 238],
            })
          )}
        />
      </Helmet>
      <div className="top-0 z-10">
        <div className="bg-vibrant-dark text-light-vibrant pb-1">
          <Nav
            className="mb-4"
            internalLinks={[
              { href: "/", label: "Home" },
              { href: "/photogallery/", label: "Gallery" },
            ]}
          />
        </div>
        <div className="px-4 md:px-8">
          <h3 id="recently" className="mx-2 font-bold">
            Recently published
          </h3>
        </div>
        <MasonryGallery
          aspectsByBreakpoint={{
            xs: 2,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5,
            "2xl": 6.1,
            "3xl": 8,
          }}
          images={recents}
          singleRow
        />
        <div className="px-4 md:px-8 mt-4 pt-2 border-t">
          <h3 id="all" className="mx-2 font-bold">
            All images
          </h3>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between px-4 md:px-8 sm:mx-auto">
          <KeywordsPicker
            keywords={[
              "Boyce Thompson Arboretum",
              "winter",
              "night",
              "coast",
              // "city",
              "landscape",
              "flowers",
              "product",
              "waterfall",
              "fireworks",
              "panoramic",
              "Portland Japanese Garden",
              // "shoot the light",
              // "sunset",
            ]}
            onChange={setKeyword}
            value={filterKeyword}
          />
          <div className="m-2 flex flex-row items-end">
            <div className="border border-black rounded mr-2">
              <Switch
                isSelected={showPalette}
                onChange={(val) => setShowPalette(val)}
              >
                <ColorPalette
                  UNSAFE_style={{
                    width: "24px",
                    margin: "0 4px",
                  }}
                />
              </Switch>
            </div>
            <Select
              label="Sort by..."
              // @ts-ignore
              onSelectionChange={setSortKey}
              selectedKey={sortKey}
            >
              <Item key="rating">Curated</Item>
              <Item key="modified">Date published</Item>
              <Item key="date">Date taken</Item>
              <Item key="hue">Hue</Item>
            </Select>
          </div>
        </div>
      </div>
      <MasonryGallery
        aspectsByBreakpoint={{
          xs: 2,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
          "2xl": 6.1,
          "3xl": 8,
        }}
        debugHue={sortKey === "hue_debug"}
        debugRating={sortKey === "rating" && showDebug}
        images={images}
        linkState={{
          sortKey,
          filterKeyword,
        }}
        showPalette={showPalette}
      />
    </>
  );
};

export const query = graphql`
  query GalleryPageQuery {
    recents: allFile(
      filter: { sourceInstanceName: { eq: "gallery" } }
      sort: { fields: { imageMeta: { datePublished: DESC } } }
      limit: 7
    ) {
      ...GalleryImageFile
    }
    all: allFile(
      filter: { sourceInstanceName: { eq: "gallery" } }
      sort: { fields: { imageMeta: { dateTaken: DESC } } }
    ) {
      ...GalleryImageFile
    }
  }

  fragment GalleryImageFile on FileConnection {
    nodes {
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
          datePublished
          meta {
            Keywords
            Rating
            ObjectName
            CreateDate
            ModifyDate
          }
          vibrant {
            ...VibrantColors
          }
        }
      }
    }
  }
`;

export default GalleryPage;
