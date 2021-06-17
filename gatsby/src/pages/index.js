import * as React from 'react';
import { Link, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { getVibrantToHelmetSafeBodyStyle, getVibrant } from '../utils';
import { Helmet } from 'react-helmet';
import { HeroA } from '../components/IndexComponents';

const IndexPage = ({ data }) => {
  const images = data.allFile.edges.map((edge) => edge.node);
  const image = React.useRef(images[Math.floor(Math.random() * images.length)]).current;
  const vibrant = getVibrant(image);
  console.log('vibrant', getVibrant(image));
  return (<>
    <Helmet>
      <body
        className="bg-vibrant-dark"
        style={getVibrantToHelmetSafeBodyStyle(vibrant)}
      />
    </Helmet>
    <main
      className="font-serif sm:block lg:grid"
    >
      <GatsbyImage
        alt=""
        className="sm:h-auto lg:h-screen hero-img"
        image={getImage(image)}
        loading="eager"
        style={{
          gridArea: '1/1',
        }} />
      <div className="relative grid place-items-center" style={{gridArea: '1/1'}}>
        <div className="m-2 flex flex-col items-end">
          <section className="rounded-xl py-6 bg-vibrant-dark-75">
            <div className="mx-auto px-6">
              <h1 className="text-vibrant-light font-black text-6xl">Chuck Dries</h1>
              <h2 className="text-vibrant italic text-2xl" >Full stack software engineer &amp; hobbyist photographer</h2>
              <ul className="text-muted-light">
                <li>Software Developer, <span className="italic">Axosoft</span></li>
                <li><HeroA className="ml-0" href="mailto:chuck@chuckdries.com">chuck@chuckdries.com</HeroA>/<span className="ml-1">602.618.0414</span></li>
                <li>
                  <HeroA className="ml-0" href="http://github.com/chuckdries">Github</HeroA>/
                  <HeroA href="https://www.linkedin.com/in/chuckdries/">LinkedIn</HeroA>/
                  <HeroA href="https://devpost.com/chuckdries">Devpost</HeroA>/
                  <HeroA href="CharlesDriesResumeCurrent.pdf">Resume [pdf]</HeroA>/
                  <HeroA href="https://medium.com/@chuckdries">Medium (blog)</HeroA>
                  {/* <a href="https://pgp.mit.edu/pks/lookup?op=get&search=0x2BD9D0871DB5A518">Public Key</a> */}
                </li>
              </ul>
            </div>
          </section>
          <Link className="text-muted-dark bg-muted-light border-muted-light hover:underline font-sans inline-block p-3 my-2 rounded-md border-2 arrow-after font-bold" to="/photogallery">
            Photography</Link>
        </div>
      </div>
      <div id="asdf" style={{ display: 'block'}}></div>
    </main>
  </>);
};

export const query = graphql`
{
  allFile(
    filter: {
      sourceInstanceName: {eq: "gallery"},
      # base: {in: ["DSC00201.jpg", "DSC05851.jpg", "DSC4180.jpg", "DSC08521.jpg", "DSC06245.jpg", "_DSC4949.jpg"]}
      }
  ) {
    edges {
      node {
        relativePath
        base
        childImageSharp {
          gatsbyImageData(
            layout: FULL_WIDTH
            # placeholder: BLURRED
            placeholder: TRACED_SVG
            # placeholder: NONE
            # blurredOptions: {width: 50}
            breakpoints: [750, 1080, 1366, 1920, 2560, 3840]
          )
          fields {
            imageMeta {
              vibrant {
                DarkMuted
                DarkVibrant
                LightMuted
                LightVibrant
                Muted
                Vibrant
              }
            }
          }
        }
      }
    }
  }
}
`;

export default IndexPage;
