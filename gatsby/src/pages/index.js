import * as React from "react"
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import '../styles/global.css';
// import "../styles/gallery.scss"
// import "../styles/index.scss"

// markup
const IndexPage = ({ data }) => {
  const images = React.useMemo(() => data.allFile.edges.map(edge => edge.node, [data]))
  console.log('images', images)

  return (
    <main className="">
      <section className="m-2 py-6 intro flex flex-col justify-center flex-auto bg-black rounded-xl">
        <div className="mx-auto px-4 md:px-2 w-full md:w-8 ">
          <h1 className="text-6xl text-pink-600">Chuck Dries</h1>
          <h2 className="text-blue-300">Software Engineer in web &amp; VR</h2>
          <ul>
            <li>Software Developer, <span className="text-gray-300 italic">Axosoft</span></li>
            <li><a className="hover:text-pink-400 underline" href="mailto:chuck@chuckdries.com">chuck@chuckdries.com</a> / <span>602.618.0414</span></li>
            <li>
              <a className="mr-1 hover:text-pink-400 underline" href="http://github.com/chuckdries">Github</a>/
              <a className="mx-1 hover:text-pink-400 underline" href="https://www.linkedin.com/in/chuckdries/">LinkedIn</a>/
              <a className="mx-1 hover:text-pink-400 underline" href="https://devpost.com/chuckdries">Devpost</a>/
              <a className="mx-1 hover:text-pink-400 underline" href="CharlesDriesResumeCurrent.pdf">Resume [pdf]</a>/
              <a className="mx-1 hover:text-pink-400 underline" href="https://medium.com/@chuckdries">Medium (blog)</a>
              {/* <a href="https://pgp.mit.edu/pks/lookup?op=get&search=0x2BD9D0871DB5A518">Public Key</a> */}
            </li>
          </ul>
        </div>
      </section>
      {/* <h1 >
        Congratulations
        <br />
        <span >— you just made a Gatsby site! </span>
        <span role="img" aria-label="Party popper emojis">
          🎉🎉🎉
        </span>
      </h1> */}
      <section className="mt-0 m-2 max-w-full flex flex-col bg-black text-gray-200 py-2 rounded-xl">
        <h2 className="ml-6 text-2xl">Photography</h2>
        <div className="gallery gallery flex-auto flex overflow-x-scroll w-full scroll-snap-x scroll-padding-6 ">
          {images.map(image => {
            const name = image.childImageSharp.fields.imageMeta.iptc.object_name || image.base
            console.log('name', name)
            // const file = data.allFile
            // console.log(fileName)
            // return <></>
            return (
              // <div style={{ maxHeight: '500px' }} className="flex-shrink-0 mr-4 scroll-snap-start bg-red-300">
              // .
              <GatsbyImage
                className="gallery-img h-full flex-shrink-0 scroll-snap-start mr-4"
                style={{
                  // maxHeight: "800px"
                  // width: '400px',
                  // height: '100%'
                }}
                key={image.base}
                image={getImage(image)}
                alt={name} />
              // </div>
            );
          })}
        </div>
      </section>
    </main>
  )
}

export const query = graphql`
query HomePageGallery {
  allFile(filter: {
    sourceInstanceName: { eq: "gallery" }}) {
    edges {
      node {
      	relativePath,
        base,
        childImageSharp{
          gatsbyImageData(
            layout: CONSTRAINED,
            placeholder: BLURRED,
            # width: 400
            # height: 900
            height: 400
          )
          fields {
            imageMeta {
              meta {
                dateTaken
              }
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

export default IndexPage