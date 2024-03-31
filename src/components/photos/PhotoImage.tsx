import { PageProps, graphql } from 'gatsby';
import React from 'react';
import { PhotoLayout } from './PhotoLayout';
import { GatsbyImage } from 'gatsby-plugin-image';

function PhotoImage({ pageContext, data }: PageProps<Queries.PhotoImageQuery, { imageId: string }>) {
  return <PhotoLayout>
    <GatsbyImage image={data.image!.childImageSharp!.gatsbyImageData} alt="photo" />
  </PhotoLayout>
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