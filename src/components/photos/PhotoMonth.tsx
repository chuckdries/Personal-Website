import { PageProps, graphql } from "gatsby";
import React from "react";
import { MasonryRow } from "../Masonry2/MasonryRow";
import { MasonryContainer } from "../Masonry2/MasonryContainer";
import { PhotoLayout } from "./PhotoLayout";

export type PhotoMonthNode = Queries.PhotoMonthQuery["images"]["nodes"][number];

function PhotoMonth({
  pageContext,
  data,
}: PageProps<Queries.PhotoMonthQuery, { monthSlug: string }>) {
  return (
    <PhotoLayout>
      <h1>{pageContext.monthSlug}</h1>
      <div>
        <MasonryContainer items={data.images.nodes} />
      </div>
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
