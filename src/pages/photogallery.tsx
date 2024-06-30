import * as React from "react";
import * as R from "ramda";
import { graphql, Link, navigate, PageProps } from "gatsby";
import { Helmet } from "react-helmet";

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
import { ToggleButton } from "../components/ToggleButton";

const SORT_KEYS = {
  hue: ["fields", "imageMeta", "vibrantHue"],
  rating: ["fields", "imageMeta", "meta", "Rating"],
  // hue_debug: ["fields", "imageMeta", "dominantHue", 0],
  hue_debug: ["fields", "imageMeta", "dominantHue", "0"],
  date: ["fields", "imageMeta", "dateTaken"],
  datePublished: ["fields", "imageMeta", "datePublished"],
};

export type GalleryImage =
  Queries.GalleryPageQueryQuery["all"]["nodes"][number];

function smartCompareDates(
  key: keyof typeof SORT_KEYS,
  left: GalleryImage,
  right: GalleryImage,
) {
  let diff = compareDates(SORT_KEYS[key], left, right);
  if (diff !== 0) {
    return diff;
  }
  return compareDates(SORT_KEYS.date, left, right);
}

const GalleryPage = ({
  data,
  location,
}: PageProps<Queries.GalleryPageQueryQuery>) => {
  const hash = location.hash ? location.hash.replace("#", "") : "";

  const params = new URLSearchParams(location.search);
  const filterKeyword = params.get("filter");
  const sortKey = params.get("sort") ?? "rating";

  const showDebug = Boolean(params.get("debug")?.length);
  const [showPalette, setShowPalette] = React.useState(false);

  const onKeywordPick = React.useCallback((newKeyword: string | null) => {
    if (newKeyword) {
      try {
        window.plausible("Filter Keyword", {
          props: { keyword: newKeyword },
        });
      } catch (e) {
        // do nothing
      }
    }
  }, []);

  const setSortKey = React.useCallback(
    (newSortKey: string) => {
      try {
        window.plausible("Sort Gallery", {
          props: { key: newSortKey },
        });
      } catch (e) {
        // do nothing
      }
      navigate(
        getGalleryPageUrl(
          { sortKey: newSortKey, keyword: filterKeyword, showDebug },
          hash,
        ),
        // { replace: true }
      );
    },
    [filterKeyword, hash, showDebug],
  );

  const removeHash = React.useCallback(() => {
    if (!hash.length || window.location.pathname !== "/photogallery/") {
      return;
    }
    console.log("remove hash");
    navigate(
      getGalleryPageUrl({ sortKey, keyword: filterKeyword, showDebug }, ""),
      { replace: true },
    );
    window.removeEventListener("scroll", removeHash);
  }, [hash, sortKey, filterKeyword, showDebug]);

  React.useEffect(() => {
    // window.addEventListener("scroll", removeHash);
    return () => {
      window.removeEventListener("scroll", removeHash);
    };
  }, [removeHash]);

  React.useEffect(() => {
    // hacky but it works for now
    requestAnimationFrame(() => {
      // don't scroll into view if user got here with back button or if we just cleared it
      if (!hash.length) {
        return;
      }
      const el = document.getElementById(hash);
      console.log("hash", hash);
      if (!el) {
        console.log("⚠️failed to find hash");
        return;
      }
      console.log("scrolling into view manually", el.offsetTop);
      el.scrollIntoView({
        block: hash.startsWith("all") ? "start" : "center",
        behavior: hash.startsWith("all") ? "smooth" : "auto",
      });
      setTimeout(() => {
        if (!hash.startsWith("all")) {
          window.addEventListener("scroll", removeHash);
        }
      }, 1000);
    });
  }, [hash, removeHash]);

  const images: GalleryImage[] = React.useMemo(() => {
    const sort =
      sortKey === "date" || sortKey === "datePublished"
        ? R.sort((node1: (typeof data)["all"]["nodes"][number], node2) =>
            smartCompareDates(sortKey, node1, node2),
          )
        : R.sort(
            // @ts-ignore
            R.descend(R.path<GalleryImage>(SORT_KEYS[sortKey])),
          );

    const filter = filterKeyword
      ? R.filter((image) =>
          R.includes(
            filterKeyword,
            R.pathOr([], ["fields", "imageMeta", "meta", "Keywords"], image),
          ),
        )
      : R.identity;

    try {
      const ret = R.pipe(
        // @ts-ignore
        sort,
        filter,
      )(data.all.nodes) as any;
      return ret;
    } catch (e) {
      console.log("caught images!", e);
      return [];
    }
  }, [data, sortKey, filterKeyword]);

  const recents = React.useMemo(() => {
    return R.sort(
      (left, right) => smartCompareDates("datePublished", left, right),
      data.recents.nodes,
    );
  }, [data]);

  const [dbgTags, setDbgTags] = React.useState(false);
  const [dbgSortKey, setDbgSortKey] = React.useState(false);
  const [dbgRating, setDbgRating] = React.useState(false);
  const [dbgName, setDbgName] = React.useState(false);
  const dataFn = React.useCallback(
    (image: GalleryImage): string[] | null => {
      if (!showDebug) {
        return null;
      }
      let data: string[] = [];
      if (dbgName) {
        data.push(image.base);
      }
      if (dbgRating) {
        data.push(R.pathOr("x", SORT_KEYS.rating, image));
      }
      if (dbgSortKey) {
        switch (sortKey) {
          case "hue":
          case "rating": {
            data.push(R.pathOr("x", SORT_KEYS[sortKey], image));
            break;
          }
          case "date":
          case "datePublished": {
            const date = R.pathOr(null, SORT_KEYS[sortKey], image);
            if (date) {
              data.push(new Date(date).toLocaleString());
            } else {
              data.push("x");
            }
            break;
          }
        }
      }
      if (dbgTags) {
        data.push(image.fields?.imageMeta?.meta?.Keywords?.join(",") ?? "x");
      }
      return data;
    },
    [showDebug, sortKey, dbgName, dbgRating, dbgSortKey, dbgTags],
  );

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
              LightVibrant: [238, 238, 238],
              DarkMuted: [238, 238, 238],
              DarkVibrant: [238, 238, 238],
            }),
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
              { href: "/projects", label: "Projects" },
            ]}
          />
        </div>
        {sortKey !== "datePublished" && (
          <div className="gradient pb-6 mb-4">
            <div className="px-4 md:px-8 flex items-baseline">
              <h3 className="mx-2 font-bold" id="recently">
                Recently published
              </h3>
              {sortKey !== "datePublished" && (
                <Link
                  className="underline cursor-pointer text-gray-500"
                  to="?sort=datePublished#all"
                >
                  show more
                </Link>
              )}
            </div>
            <MasonryGallery
              aspectsByBreakpoint={{
                xs: 3,
                sm: 3,
                md: 4,
                lg: 4,
                xl: 5,
                "2xl": 6,
                "3xl": 8,
              }}
              images={recents}
              linkState={{
                sortKey: "datePublished",
                filterKeyword,
              }}
              singleRow
            />
          </div>
        )}
        <div className="px-4 md:px-8">
          <h3 className="mx-2 font-bold" id="all">
            All images
          </h3>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between px-4 md:px-8 sm:mx-auto">
          <KeywordsPicker
            getHref={(val, selected) =>
              selected
                ? getGalleryPageUrl({ keyword: null, sortKey, showDebug }, hash)
                : getGalleryPageUrl({ keyword: val, sortKey, showDebug }, hash)
            }
            keywords={[
              // "Boyce Thompson Arboretum",
              "winter",
              "night",
              "coast",
              // "city",
              "landscape",
              "flowers",
              "product",
              // "waterfall",
              "fireworks",
              // "panoramic",
              // "Portland Japanese Garden",
              // "Film",
              // "shoot the light",
              "sunset",
            ]}
            onPick={onKeywordPick}
            value={filterKeyword}
          />
          <div className="my-2 mx-2 flex flex-row items-end">
            {showDebug && (
              <div className="mr-1">
                <ToggleButton isSelected={dbgName} onChange={setDbgName}>
                  name
                </ToggleButton>
                <ToggleButton isSelected={dbgRating} onChange={setDbgRating}>
                  rating
                </ToggleButton>
                <ToggleButton isSelected={dbgSortKey} onChange={setDbgSortKey}>
                  sort key
                </ToggleButton>
                <ToggleButton isSelected={dbgTags} onChange={setDbgTags}>
                  tags
                </ToggleButton>
              </div>
            )}
            {/* <div className="mr-1">
              <ToggleButton
                isSelected={showPalette}
                onChange={setShowPalette}
              >
                <ColorPalette
                  UNSAFE_style={{
                    width: "22px",
                    margin: "0 0px",
                  }}
                />
              </ToggleButton>
            </div> */}
            <Select
              label="Sort by..."
              // @ts-expect-error React.key, but string is more convenient for the state
              onSelectionChange={setSortKey}
              selectedKey={sortKey}
            >
              <Item key="rating">Curated</Item>
              <Item key="datePublished">Date published</Item>
              <Item key="date">Date taken</Item>
              <Item key="hue">Hue</Item>
            </Select>
          </div>
        </div>
      </div>
      <MasonryGallery
        aspectsByBreakpoint={{
          xs: 1.5,
          sm: 2,
          md: 2.5,
          lg: 3,
          xl: 3.8,
          "2xl": 4.9,
          "3xl": 6.1,
        }}
        dataFn={dataFn}
        debugHue={sortKey === "hue_debug"}
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
      filter: { sourceInstanceName: { eq: "photos" } }
      sort: { fields: { imageMeta: { datePublished: DESC } } }
      limit: 10
    ) {
      ...GalleryImageFile
    }
    all: allFile(
      filter: {
        sourceInstanceName: { eq: "photos" }
        fields: { imageMeta: { meta: { Rating: { gte: 4 } } } }
      }
      sort: { fields: { imageMeta: { meta: { Rating: DESC } } } }
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
          # vibrantHue
          # dominantHue
          dateTaken
          datePublished
          meta {
            Keywords
            Rating
            ObjectName
            CreateDate
            ModifyDate
          }
          # vibrant {
          #   ...VibrantColors
          # }
        }
      }
    }
  }
`;

export default GalleryPage;
