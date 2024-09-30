import { PageProps, graphql, navigate } from "gatsby";
import React, { useLayoutEffect, useMemo } from "react";
import * as R from "ramda";
import { MasonryContainer, MasonryGroup } from "../Masonry2/MasonryContainer";
import { PhotoLayout } from "./PhotoLayout";

export type PhotoMonthNode = Queries.PhotoMonthQuery["images"]["nodes"][number];

function PhotoMonth({
  pageContext,
  data,
}: PageProps<Queries.PhotoMonthQuery, { monthSlug: string, month: string, year: string, }>) {
  useLayoutEffect(() => {
    navigate("/photos");
  }, []);
  const groups: MasonryGroup[] = useMemo(
    () => [
      {
        slug: pageContext.monthSlug,
        tickLabel: pageContext.monthSlug,
        label: pageContext.monthSlug,
        month: pageContext.month,
        year: pageContext.year,
        nodes: R.clone(data.images.nodes),
      } as MasonryGroup,
    ],
    [data.images.nodes, pageContext],
  );
  return (
    <PhotoLayout>
      <></>
      {/* <h1>{pageContext.monthSlug}</h1> */}
      {/* <div>
        <MasonryContainer groups={groups} />
      </div> */}
    </PhotoLayout>
  );
}

export default PhotoMonth;

export const query = graphql`
  query PhotoMonth($monthSlug: String) {
    images: allFile(
      filter: {
        sourceInstanceName: { eq: "photos" }
        fields: { organization: { monthSlug: { eq: $monthSlug } } }
      }
      sort: { fields: { imageMeta: { dateTaken: DESC } } }
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
            }
          }
        }
        childImageSharp {
          fluid {
            aspectRatio
          }
          gatsbyImageData(
            layout: CONSTRAINED
            width: 500
            placeholder: DOMINANT_COLOR
          )
        }
      }
    }
  }
`;
