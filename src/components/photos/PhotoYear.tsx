import { PageProps, graphql } from "gatsby";
import React from "react";

function PhotoYear({
  pageContext,
  data,
}: PageProps<Queries.PhotoYearQuery, { year: string }>) {
  return (
    <>
      <h1>{pageContext.year}</h1>
      {JSON.stringify(data.images.nodes)}
    </>
  );
}

export default PhotoYear;

// export const query = graphql`
//   query PhotoYear($year: String) {
//     images: allFile(
//       filter: {
//         sourceInstanceName: { eq: "photos" }
//         fields: { organization: { yearFolder: { eq: $year } } }
//       }
//       sort: { fields: { imageMeta: { dateTaken: DESC } } }
//     ) {
//       nodes {
//         id
//         relativePath
//         fields {
//           organization {
//             monthSlug
//           }
//           imageMeta {
//             dateTaken
//             meta {
//               Rating
//             }
//           }
//         }
//         # childImageSharp {
//         #   gatsbyImageData
//         # }
//       }
//     }
//   }
// `;
