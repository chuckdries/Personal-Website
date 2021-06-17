import * as React from 'react';
import { Link, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { getVibrantToHelmetSafeBodyStyle, getVibrant } from '../utils';
import { Helmet } from 'react-helmet';
import { HeroA } from '../components/IndexComponents';
import classnames from 'classnames';

const IndexPage = ({ data: { allFile: { edges } } }) => {
  const [isClient, setIsClient] = React.useState(false);
  const images = React.useMemo(() => edges.map((edge) => edge.node), [edges]);
  const image = React.useMemo(() => {
    if (!isClient) {
      return images[0];
    }
    return images[Math.floor(Math.random() * images.length)];
  }, [images, isClient]);
  const vibrant = getVibrant(image, isClient);
  console.log('vibrant', vibrant);
  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);
  return (<>
    <Helmet>
      <body
        className={classnames(isClient ? 'bg-vibrant-dark' : '')}
        style={getVibrantToHelmetSafeBodyStyle(vibrant)}
      />
    </Helmet>
    <main
      className="font-serif sm:block md:grid hero"
    >
      <GatsbyImage
        alt=""
        className={classnames(
          'md:h-screen hero-img sm:h-auto',
          // isClient ? 'sm:h-auto' : 'sm:h-2'
        )}
        image={getImage(image)}
        key={image.base}
        loading="eager"
        style={{
          gridArea: '1/1',
          // hide for SSR pass so it doesn't flash in then get replaced when we pick a new random one
          // TODO: replace image with empty div for SSR so we don't always load duck image
          // TODO: hardcode height on mobile for empty div
          visibility: isClient ? 'visible' : 'hidden',
        }} />
      <div className="relative grid place-items-center" style={{gridArea: '1/1'}}>
        <div className="m-2 flex flex-col items-end">
          <section className={classnames('rounded-xl py-6', isClient && ' bg-vibrant-dark-75')}>
            <div className="mx-auto px-6">
              <h1 className={classnames('font-black text-6xl', isClient && 'text-vibrant-light')}>Chuck Dries</h1>
              <h2 className={classnames('italic text-2xl', isClient && 'text-vibrant')}>Full stack software engineer &amp; hobbyist photographer</h2>
              <ul className={classnames(isClient && 'text-muted-light')}>
                <li>Software Developer, <span className="italic">Axosoft</span></li>
                <li><HeroA className="ml-0" href="mailto:chuck@chuckdries.com" isClient={isClient}>chuck@chuckdries.com</HeroA>/<span className="ml-1">602.618.0414</span></li>
                <li>
                  <HeroA className="ml-0" href="http://github.com/chuckdries" isClient={isClient}>Github</HeroA>/
                  <HeroA href="https://www.linkedin.com/in/chuckdries/" isClient={isClient}>LinkedIn</HeroA>/
                  <HeroA href="https://devpost.com/chuckdries" isClient={isClient}>Devpost</HeroA>/
                  <HeroA href="/public/CharlesDriesResumeCurrent.pdf" isClient={isClient}>Resume [pdf]</HeroA>/
                  <HeroA href="https://medium.com/@chuckdries" isClient={isClient}>Medium (blog)</HeroA>
                  {/* <a href="https://pgp.mit.edu/pks/lookup?op=get&search=0x2BD9D0871DB5A518">Public Key</a> */}
                </li>
              </ul>
            </div>
          </section>
          <Link
            className={classnames(
              'hover:underline inline-block p-4 px-5 my-2 rounded-md border-2 arrow-right-after font-bold font-serif',
              isClient && 'text-muted-dark bg-muted-light border-muted-light')} 
            to="/photogallery"
          >
            Photo Gallery</Link>
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
      base: {nin: ["DSC01699.jpg", "DSC02981.jpg", "_DSC4155.jpg", "DSC02538.jpg", "DSC05851.jpg"]}
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
            # placeholder: TRACED_SVG
            placeholder: NONE
            # blurredOptions: {width: 50}
            breakpoints: [750, 1080, 1366, 1920, 2560]
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
