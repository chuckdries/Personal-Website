import React, { ReactNode, useMemo } from "react";
import * as R from "ramda";
import { PageProps, graphql, useScrollRestoration } from "gatsby";
import {
  MasonryContainer,
  MasonryGroup,
} from "../components/Masonry2/MasonryContainer";
import { PhotoLayout } from "../components/photos/PhotoLayout";
import { TimelineSlider, TimelineStop } from "../components/Masonry2/TimelineSlider";

const FIXED_STOPS: TimelineStop[] = [
  // { slug: "welcome", emphasis: 1 },
]

function getMonthName(month: number) {
  return new Date(
    2024,
    month - 1,
    1,
  ).toLocaleString("en", { month: "long" })
}

const Photos = ({ data }: PageProps<Queries.AllPhotoGroupedQuery>) => {
  useScrollRestoration('photos');
  const [groups, stops] = useMemo((): [MasonryGroup[], TimelineStop[]] => {
    const _groups: MasonryGroup[] = [];
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
      if (year.fieldValue === "Older") {
        _groups.push({
          slug: "Older",
          tickLabel: "Older",
          label: <h2 className="text-2xl">Older</h2>,
          nodes: R.flatten(year.group.map((m) => m.nodes)),
        });
      } else {
        const sortedMonths = R.sort(
          (a, b) => Number(b.fieldValue!) - Number(a.fieldValue!),
          year.group,
        );
        for (const month of sortedMonths) {
          const monthName = getMonthName(Number(month.fieldValue!));
          _groups.push({
            slug: month.nodes[0].fields!.organization!.monthSlug!,
            tickLabel: `${monthName} ${month.nodes[0].fields!.organization!.year!}`,
            label: (
              <div className="p-2 h-[100px]">
                <h3 className="text-lg m-2">
                  {month.nodes[0].fields!.organization!.year!}
                </h3>
                <h2 className="text-[60px] m-2">
                  {monthName}
                </h2>
              </div>
            ),
            nodes: R.clone(month.nodes),
          });
        }
      }
    }
    const stops: TimelineStop[] = _groups.map((g) => ({
      slug: g.slug,
      label: g.label,
      tickLabel: g.tickLabel,
      emphasis: g.slug.endsWith("January") ? 1 : 2,
    })); 
    return [_groups, [...FIXED_STOPS, ...stops]];
  }, [data.allFile.group]);

  return (
    <PhotoLayout>
      <MasonryContainer
        groups={groups}
        maxWidth="calc(100vw - 200px)"
        widthFn={(n) => `calc(calc(100vw - 200px) * ${n})`}
      />
      <div className="h-screen w-[120px]" style={{ position: "fixed", top: 0, right: 0 }}>
        <TimelineSlider stops={stops} />
      </div>
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
