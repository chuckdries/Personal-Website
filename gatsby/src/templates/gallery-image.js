import React from "react"
import { graphql } from 'gatsby'
import { getMeta, getName } from "../utils";
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const GalleryImage = ({ pageContext, data }) => {
  const image = data.allFile.edges[0].node
  console.log(getMeta(image));
  const name = getName(image);
  return (
    <div className="bg-black min-h-screen">
      <h1>{name}</h1>
      <GatsbyImage
        className=""
        style={{
          width: '100vw',
          maxHeight: '100%'
          // maxHeight: "800px"
          // width: '400px',
          // height: '100%'
        }}
        key={image.base}
        image={getImage(image)}
        alt={name} />
      <p>{getMeta(image).iptc.caption}</p>
    </div>
  );
}

export const query = graphql`
  query GalleryImage($imageFilename: String) {
  allFile(filter: {sourceInstanceName: {eq: "gallery"}, base: {eq: $imageFilename}}) {
    edges {
      node {
        relativePath
        base
        childImageSharp{
          fluid {
            aspectRatio
          }
          gatsbyImageData(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 1920
          )
          fields {
            imageMeta {
              dateTaken
              iptc {
                caption
                object_name
              }
              exif {
                FNumber
                ExposureTime
                ShutterSpeedValue
                ISO
              }
            }
          }
        }
      }
    }
  }
}


`

export default GalleryImage