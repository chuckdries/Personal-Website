import { Link, PageProps, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React, { useMemo } from "react";
import * as R from "ramda";
import { PhotoLayout } from "./PhotoLayout";
import { MonthTile } from "./PhotoYear/MonthTile";

export type PhotoYearNode = Queries.PhotoYearQuery["allFile"]["group"][number]["nodes"][number];

export interface PhotoYearMonth {
  fieldValue: number;
  nodes: readonly PhotoYearNode[];
  score: number;
}

function PhotoYear({
  pageContext,
  data,
}: PageProps<Queries.PhotoYearQuery, { year: string }>) {
  const months = useMemo(() => {
    const cleaned: PhotoYearMonth []= R.map(
      (group) => ({
        nodes: group.nodes,
        fieldValue: parseInt(group.fieldValue!),
        score: R.sum(group.nodes.map((node) => node.fields!.imageMeta!.meta!.Rating!).filter(Boolean)),
      }),
      data.allFile.group,
    );
    return R.sortBy(R.prop("fieldValue"), cleaned);
  }, [data.allFile.group]);

  return (
    <PhotoLayout>
      <h1>{pageContext.year}</h1>
      <div className="flex flex-wrap">
        {months.map((month) => (
          <MonthTile key={month.fieldValue} month={month} />
        ))}
      </div>
    </PhotoLayout>
  );
}

export default PhotoYear;

export const query = graphql`
  query PhotoYear($year: String) {
    allFile(
      filter: {
        sourceInstanceName: { eq: "photos" }
        fields: {
          organization: { yearFolder: { eq: $year } }
          imageMeta: { meta: { Rating: { ne: null } } }
        }
      }
      sort: { fields: { imageMeta: { meta: { Rating: DESC } } } }
    ) {
      group(field: { fields: { organization: { month: SELECT } } }, limit: 5) {
        fieldValue
        nodes {
          id
          relativePath
          fields {
            organization {
              monthSlug
              month
            }
            imageMeta {
              dateTaken
              meta {
                Rating
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
`;
