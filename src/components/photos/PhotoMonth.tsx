import { PageProps, graphql } from 'gatsby';
import React from 'react';

function PhotoMonth({ pageContext, data }: PageProps<unknown, { month: string }>) {
  return <h1>{pageContext.month}</h1>
}

export default PhotoMonth;

// export const query = graphql`
//   query PhotoYear($year: String) {
//     image: file(id: { eq: $imageId }) {
//       id,
//       relativePath
//       childImageSharp {
//         gatsbyImageData
//       }
//     }
//   }
// `;