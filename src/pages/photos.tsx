import React, { ReactNode, useEffect, useMemo, useState } from "react";
import * as R from "ramda";
import { PageProps, graphql } from "gatsby";
import {
  MasonryContainer,
  MasonryGroup,
} from "../components/Masonry2/MasonryContainer";
import { PhotoLayout } from "../components/photos/PhotoLayout";
import {
  TimelineSlider,
  TimelineStop,
} from "../components/Masonry2/TimelineSlider";
import Nav from "../components/Nav";
import { MasonryRow } from "../components/Masonry2/MasonryRow";

// const FIXED_STOPS: TimelineStop[] = [
//   // { slug: "welcome", emphasis: 1 },
// ];

function useScrollState() {}

const Photos = ({ data }: PageProps<Queries.AllPhotoGroupedQuery>) => {
  const [groups, stops] = useMemo((): [MasonryGroup[], TimelineStop[]] => {
    const _groups: MasonryGroup[] = [];
    const stops: TimelineStop[] = [];
    const sortedYears = R.sort((a, b) => {
      if (a.fieldValue === "Older") {
        return 1;
      }
      if (b.fieldValue === "Older") {
        return -1;
      }
      return Number(b.fieldValue!) - Number(a.fieldValue!);
    }, data.allFile.group);

    for (const year of sortedYears) {
      stops.push({
        slug: year.fieldValue!,
        tickLabel: year.fieldValue!,
        emphasis: year.fieldValue === "Older" ? 1 : 2,
      });
      if (year.fieldValue === "Older") {
        _groups.push({
          slug: "Older",
          tickLabel: "Older",
          month: null,
          year: null,
          nodes: R.flatten(year.group.map((m) => m.nodes)),
        });
      } else {
        const sortedMonths = R.sort(
          (a, b) => Number(b.fieldValue!) - Number(a.fieldValue!),
          year.group,
        );
        for (const month of sortedMonths) {
          const monthName = month.nodes[0].fields!.organization!.monthSlug?.split("/")[1]!;
          _groups.push({
            slug: month.nodes[0].fields!.organization!.monthSlug!,
            tickLabel: `${monthName} ${month.nodes[0].fields!.organization!.year!}`,
            year: String(month.nodes[0].fields!.organization!.year!),
            month: monthName,
            nodes: R.clone(month.nodes),
          });
        }
      }
    }
    // const stops: TimelineStop[] = _groups.map((g) => ({
    //   slug: g.slug,
    //   label: g.label,
    //   tickLabel: g.tickLabel,
    //   emphasis: g.slug.endsWith("January") ? 1 : 2,
    // }));
    return [_groups, stops];
  }, [data.allFile.group]);

  const [initialScroll, setInitialScroll] = useState(0);
  useEffect(() => {
    // TODO: keep in router state
    const prevScroll = sessionStorage.getItem("photos-scroll");
    if (prevScroll) {
      setInitialScroll(Number(prevScroll));
    }
  }, []);

  return (
    <PhotoLayout omitNav>
      {/* <div className="flex-auto relative w-[calc(100vw-120px)]"> */}
      <div className="flex-auto relative w-screen">
        {/* TODO take childrenHeight prop? */}
        <MasonryContainer
          groups={groups}
          onScroll={(data) => {
            sessionStorage.setItem("photos-scroll", `${data.scrollOffset}`);
          }}
          scrollPosition={initialScroll}
        >
          {(row, { index, style }, targetAspect, width) => {
            switch (row.type) {
              case "c":
                return (
                  <div className="h-[200px] flex flex-col">
                    <Nav className="mb-4" scheme="light" />
                  </div>
                );
              case "l":
                return (
                  <div className="relative" key={row.slug} style={style}>
                    {row.slug === "Older" ? (
                      <div className="p-4 lg:pl-8 flex flex-col justify-end h-full">
                        <h2 className="text-3xl md:text-4xl m-0 md:m-1 font-bold">
                          Older
                        </h2>
                      </div>
                    ) : (
                      <div className="p-4 lg:pl-8 flex justify-start items-end h-full">
                        <h2 className="text-3xl md:text-4xl m-0 md:m-1">
                          <span className="font-bold">{row.month}</span> <span className="font-extralight opacity-70">{row.year}</span>
                        </h2>
                        {/* <h3 className="text-lg m-0 md:m-1"></h3> */}
                      </div>
                    )}
                  </div>
                );
              case "i":
                return (
                  <div
                    className="relative flex"
                    key={`${row.groupIndex}-${row.startIndex}`}
                    style={style}
                  >
                    <MasonryRow
                      items={groups[row.groupIndex].nodes.slice(
                        row.startIndex,
                        row.startIndex + row.images,
                      )}
                      nodes={groups[row.groupIndex].nodes.map(
                        (n) => n.fields!.organization!.slug!,
                      )}
                      row={row}
                      targetAspect={targetAspect}
                      width={width - 10}
                      // widthFn={widthFn}
                    />
                  </div>
                );
            }
          }}
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
  query AllPhotoGrouped {
    allFile(
      filter: { sourceInstanceName: { eq: "photos" } }
      sort: { fields: { imageMeta: { dateTaken: DESC } } }
    ) {
      group(field: { fields: { organization: { yearFolder: SELECT } } }) {
        fieldValue
        group(field: { fields: { organization: { month: SELECT } } }) {
          fieldValue
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
    }
  }
`;
