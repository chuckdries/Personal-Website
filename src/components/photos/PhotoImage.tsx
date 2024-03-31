import { PageProps, graphql } from 'gatsby';
import React from 'react';

function PhotoImage({ pageContext, data }: PageProps<unknown, { imageId: string }>) {
  return <h1>{pageContext.imageId}</h1>
}

export default PhotoImage;

export const query = graphql`
  query PhotoImage($imageId: String) {
    image: file(id: { eq: $imageId }) {
      id,
      relativePath
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`;