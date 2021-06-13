import * as React from "react"
import { graphql, Link } from 'gatsby'
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { getMeta } from "../utils"


const GalleryPage = ({ data }) => {
  const images = React.useMemo(() =>
    data.allFile.edges
      .map(edge => edge.node, [data])
      .sort((left, right) => {
        const leftDate = new Date(getMeta(left).dateTaken)
        console.log(leftDate)
        const rightDate = new Date(getMeta(right).dateTaken)
        if (leftDate < rightDate) {
          return 1;
        }
        if (leftDate > rightDate) {
          return -1;
        }
        return 0;
      }) // TODO HERE
    , data)
  return (<div className="bg-black">

    <h1 className="text-2xl">Gallery</h1>
    {images.map(image => {
      console.log('ar', image.childImageSharp)
      const name = getMeta(image).iptc.object_name || image.base
      // const {
      //   name: object_name,
      //   aspectRatio
      // }
      // const file = data.allFile
      // console.log(fileName)
      // return <></>
      return (
        // <div style={{ maxHeight: '500px' }} className="flex-shrink-0 mr-4 scroll-snap-start bg-red-300">
        // .
        <>
          <Link to={`/gallery/${image.base}`}>
            {/* <span>{name}</span> */}
            <GatsbyImage
              className=""
              style={{
                // maxHeight: "800px"
                // width: '400px',
                // height: '100%'
              }}
              key={image.base}
              image={getImage(image)}
              alt={name} />
          </Link>
        </>
      );
    })}
  </div>)
}

export const query = graphql`
query GalleryPageQuery {
  allFile(filter: {
    sourceInstanceName: { eq: "gallery" }}) {
    edges {
      node {
      	relativePath,
        base,
        childImageSharp{
          fluid {
            aspectRatio
          },
          gatsbyImageData(
            layout: CONSTRAINED,
            width: 400
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
}`;

export default GalleryPage