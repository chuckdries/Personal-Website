import React from "react"
import { graphql } from 'gatsby'
import { getMeta, getName } from "../utils";
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Helmet } from "react-helmet";

const GalleryImage = ({ pageContext, data }) => {
  const image = data.allFile.edges[0].node
  console.log(getMeta(image));
  const name = getName(image);
  return (<>
  <Helmet>
    <title>{name} - Gallery | Chuck Dries</title>
    <body className="bg-black" />
  </Helmet>
    <div className="h-screen w-screen flex flex-col">
      <h1>{name}</h1>
      <GatsbyImage
        className="flex-auto"
        loading='eager'
        objectFit='contain'
        style={{
          width: '100%',
          height: '100%'
        }}
        key={image.base}
        image={getImage(image)}
        alt={name} />
      <p>{getMeta(image).iptc.caption}</p>
    </div>
  </>);
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
            # placeholder: DOMINANT_COLOR
            # placeholder: TRACED_SVG
            height: 2048
          )
          fields {
            imageMeta {
              dateTaken
              iptc {
                caption
                object_name
                keywords
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