import React, {
  Key,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as R from "ramda";
import { PageProps, graphql } from "gatsby";
import {
  MasonryContainer,
  MasonryGroup,
} from "../../components/Masonry2/MasonryContainer";
import { PhotoLayout } from "../../components/photos/PhotoLayout";
import {
  TimelineSlider,
  TimelineStop,
} from "../../components/Masonry2/TimelineSlider";
import Nav from "../../components/Nav";
import { MasonryRow } from "../../components/Masonry2/MasonryRow";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { Item, Select } from "../../components/Select";
import { PhotoMonthNode } from "../../components/photos/PhotoMonth";
import classNames from "classnames";
import { FilterBar } from "../../components/photos/FilterBar";

// const FIXED_STOPS: TimelineStop[] = [
//   // { slug: "welcome", emphasis: 1 },
// ];

function useScrollState() {}

function filterNodes(nodes: PhotoMonthNode[], or: string | null | undefined) {
  if (or === "portrait") {
    return R.filter((node) => {
      const matches = (node.childImageSharp?.fluid?.aspectRatio ?? 0) <= 1;
      return matches;
    }, nodes);
  }
  if (or === "landscape") {
    return R.filter(
      (node) => (node.childImageSharp?.fluid?.aspectRatio ?? 1) >= 1,
      nodes,
    );
  }
  return nodes;
}

const Photos = ({ data }: PageProps<Queries.FavoritePhotosQuery>) => {
  const [orientation, setOrientation] = useQueryParam("or", StringParam);
  const groups = useMemo((): MasonryGroup[] => {
    const _groups: MasonryGroup[] = [
      {
        slug: 'favorites!',
        tickLabel: 'favorites',
        label: (
          <h2 className="text-3xl md:text-4xl m-0 md:m-1">
            <span className="font-bold">
              Favorites
            </span>
          </h2>
        ),
        nodes: filterNodes(R.clone(data.allFile.nodes), orientation),
      }
    ];

    // const stops: TimelineStop[] = _groups.map((g) => ({
    //   slug: g.slug,
    //   label: g.label,
    //   tickLabel: g.tickLabel,
    //   emphasis: g.slug.endsWith("January") ? 1 : 2,
    // }));
    return _groups;
  }, [data.allFile, orientation]);

  const onOrientationSelection = useCallback((or: Key) => {
    if (or === "all") {
      setOrientation(undefined);
      return;
    }
    if (typeof or === "string" && ["portrait", "landscape"].includes(or)) {
      setOrientation(or);
    }
  }, []);

  const [navOutOfView, setNavOutOfView] = useState(false);
  const [scrollingUp, setScrollingUp] = useState(false);

  const [initialScroll, setInitialScroll] = useState(0);
  useEffect(() => {
    // TODO: keep in router state
    const prevScroll = sessionStorage.getItem("photos-scroll");
    if (prevScroll) {
      setInitialScroll(Number(prevScroll));
    }
  }, []);

  const filterGadget = (
    <div className="flex gap-2">
      <Select
        selectedKey={orientation ?? "all"}
        onSelectionChange={onOrientationSelection}
      >
        <Item key="all">All Orientations</Item>
        <Item key="portrait">Portrait</Item>
        <Item key="landscape">Landscape</Item>
      </Select>
      <Select
        selectedKey={orientation ?? "all"}
        onSelectionChange={onOrientationSelection}
      >
        <Item key="all">All Orientations</Item>
        <Item key="portrait">Portrait</Item>
        <Item key="landscape">Landscape</Item>
      </Select>
    </div>
  );
  return (
    <PhotoLayout omitNav>
      {/* <div className="flex-auto relative w-[calc(100vw-120px)]"> */}
      <div
        className={classNames(
          navOutOfView && scrollingUp
            ? "translate-y-0"
            : "translate-y-[-200px]",
          "transition-transform fixed top-0 left-0 right-0 z-10 p-2 px-4 lg:px-8",
        )}
      >
        <div
          className={classNames(
            "p-2 gap-2 flex justify-between items-center",
            "bg-gradient-to-t from-gray-300/60 to-gray-100/60 backdrop-blur-lg rounded-full mx-auto shadow-lg",
          )}
        >
          <FilterBar />
          {filterGadget}
        </div>
      </div>
      <div className="flex-auto relative w-screen">
        {/* TODO take childrenHeight prop? */}
        <MasonryContainer
          groups={groups}
          onScroll={(data) => {
            sessionStorage.setItem("photos-scroll", `${data.scrollOffset}`);
            if (!navOutOfView && data.scrollOffset > 250) {
              setNavOutOfView(true);
            } else if (navOutOfView && data.scrollOffset <= 250) {
              setNavOutOfView(false);
            }
            if (!scrollingUp && data.scrollDirection === "backward") {
              setScrollingUp(true);
            } else if (scrollingUp && data.scrollDirection === "forward") {
              setScrollingUp(false);
            }
          }}
          scrollPosition={initialScroll}
        >
          <Nav className="mb-4" scheme="light" />
          <div className="w-full px-4 lg:px-8 flex justify-between">
            <FilterBar />
            {filterGadget}
          </div>
        </MasonryContainer>
      </div>
      {/* hypothetical API uses like a collection of <Masonry(Content|Label|Image)Row aspect={aspect}>...</> passed to children */}
      {/* <div
        className="h-screen w-[120px]"
        style={{ position: "fixed", top: 0, right: 0 }}
      >
        <TimelineSlider stops={stops} />
      </div> */}
    </PhotoLayout>
  );
};

export default Photos;

export const query = graphql`
  query FavoritePhotos {
    allFile(
      filter: {
        sourceInstanceName: { eq: "photos" }
        fields: { imageMeta: { meta: { Rating: { ne: null } } } }
      }
      sort: { fields: { imageMeta: { meta: { Rating: DESC } } } }
    ) {
      nodes {
        id
        relativePath
        fields {
          organization {
            monthSlug
            month
            year
            slug
          }
          imageMeta {
            dateTaken
            meta {
              Rating
              Keywords
            }
          }
        }
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
      }
    }
  }
`;
