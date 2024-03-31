import React, { useMemo } from "react";
import * as R from "ramda";
import { PageProps, graphql } from "gatsby";
import {
  MasonryContainer,
  MasonryGroup,
} from "../components/Masonry2/MasonryContainer";

const Photos = ({ data }: PageProps<Queries.AllPhotoGroupedQuery>) => {
  const groups: MasonryGroup[] = useMemo(() => {
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
      if (
        year.fieldValue === "Older"
      ) {
        _groups.push({
          slug: "Older",
          label:<h2 className="text-2xl">Older</h2>,
          nodes: R.flatten(year.group.map((m) => m.nodes)),
        })
          
      } else {
        const sortedMonths = R.sort(
          (a, b) => Number(b.fieldValue!) - Number(a.fieldValue!),
          year.group,
        );
        for (const month of sortedMonths) {
          _groups.push({
            slug: month.nodes[0].fields!.organization!.monthSlug!,
            label: (
              <div className="mx-2 flex items-baseline">
                <h2 className="text-2xl">
                  {month.nodes[0].fields!.organization!.year!}
                </h2>
                <h3 className="ml-2">
                  {new Date(
                    2024,
                    month.nodes[0].fields!.organization!.month!,
                    1,
                  ).toLocaleString("en", { month: "long" })}
                </h3>
              </div>
            ),
            nodes: R.clone(month.nodes),
          });
        }
      }
    }
      console.log(
        "slugs",
        _groups.map((g) => g.slug),
      );
    return _groups;
  }, [data.allFile.group]);
  return (
    <div>
      <MasonryContainer groups={groups} />
    </div>
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
