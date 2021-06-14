import React from "react"
import { graphql } from 'gatsby'
import { getMeta, getName } from "../utils";
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Helmet } from "react-helmet";

const GalleryImage = ({ pageContext, data }) => {
  const image = data.allFile.edges[0].node
  const ar = image.childImageSharp.fluid.aspectRatio;
  console.log(ar);
  // const imageStyle = {}
  // if (ar > 1) {
  //   imageStyle.width = '90vw'
  // } else {
  //   imageStyle.height = '90vh'
  // }

  const name = getName(image);
  return (<>
    <Helmet>
      <title>{name} - Gallery | Chuck Dries</title>
      <body className="bg-black" />
    </Helmet>
    <div className="min-h-screen flex flex-col justify-center">
      {/* use inline-block to set width to same as children but it still doesn't work for vert images */}
      {/* todo: totally different layout for vertical images? by inspecting aspect ratio? Ohhhh yes */}
      <div style={{margin: '0 5vw'}} className="mx-auto">
        <h1 className="text-2xl mt-2">{name}</h1>
        <GatsbyImage
          className=""
          loading='eager'
          objectFit='contain'
          style={{
            // width: '90vw',
            height: '100%',
            maxHeight: '90vh'
          }}
          key={image.base}
          image={getImage(image)}
          alt={name} />
        <p>{getMeta(image).iptc.caption}</p>
      </div>
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
            # placeholder: BLURRED
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