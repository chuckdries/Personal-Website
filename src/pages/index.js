import * as React from 'react';
import { Link, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { getVibrantToHelmetSafeBodyStyle, getVibrant } from '../utils';
import { Helmet } from 'react-helmet';
import { take } from 'ramda';
import classnames from 'classnames';

import { HeroA } from '../components/IndexComponents';

// TODO: better text colors in situations of low contrast

const getDifferentRand = (range, lastNs, iterations = 0) => {
  const n = Math.floor(Math.random() * range);
  if (lastNs.findIndex(x => x === n) > -1 && iterations < 5) {
    console.log('got dupe, trying again', n);
    return getDifferentRand(range, lastNs, iterations + 1);
  }
  return n;
};

const IndexPage = ({ data: { allFile: { edges } } }) => {
  const [isClient, setIsClient] = React.useState(false);
  const images = React.useMemo(() => edges.map((edge) => edge.node), [edges]);
  const image = React.useMemo(() => {
    if (!isClient) {
      return images[0];
    }
    const lastThreeImages = JSON.parse(localStorage.getItem('lastHeros')) || [];
    const imageIndex = getDifferentRand(images.length, lastThreeImages);
    localStorage.setItem('lastHeros', JSON.stringify(take(3, [imageIndex, ...lastThreeImages])));
    return images[imageIndex];
  }, [images, isClient]);
  const vibrant = getVibrant(image);
  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);
  return (<>
    <Helmet>
      <title>Chuck Dries</title>
      <body
        className={classnames(isClient ? 'bg-vibrant-dark' : '')}
        style={getVibrantToHelmetSafeBodyStyle(vibrant)}
      />
    </Helmet>
    <main
      className="font-serif sm:block md:grid hero"
    >
      {isClient ? 
        <GatsbyImage
          alt=""
          className={classnames(
            'md:h-screen sm:h-two-thirds-vw',
          )}
          image={getImage(image)}
          loading="eager"
          style={{
            gridArea: '1/1',
          }} />
        // 67vw = 1/1.49253731 = 1/aspect ratio of my camera lol
        : <div className="md:h-screen sm:h-two-thirds-vw" style={{gridArea: '1/1' }}></div> }
      <div className="relative grid place-items-center" style={{gridArea: '1/1'}}>
        <div className="m-3 flex flex-col items-end">
          <section className={classnames('rounded-xl py-6', isClient && ' bg-vibrant-dark-75')}>
            <div className="mx-auto px-6">
              <h1 className={classnames('font-black text-6xl', isClient && 'text-vibrant-light')}>Chuck Dries</h1>
              <h2 className={classnames('italic text-2xl', isClient && 'text-vibrant')}>Full stack software engineer &amp; hobbyist photographer</h2>
              <ul className={classnames(isClient && 'text-muted-light')}>
                <li>Software Developer, <span className="italic">Axosoft</span></li>
                <li><HeroA className="ml-0" href="mailto:chuck@chuckdries.com" isClient={isClient}>chuck@chuckdries.com</HeroA>/<span className="ml-2">602.618.0414</span></li>
                <li>
                  <HeroA className="ml-0" href="http://github.com/chuckdries" isClient={isClient}>Github</HeroA>/
                  <HeroA href="https://www.linkedin.com/in/chuckdries/" isClient={isClient}>LinkedIn</HeroA>/
                  <HeroA href="https://devpost.com/chuckdries" isClient={isClient}>Devpost</HeroA>/
                  <HeroA href="/CharlesDriesResumeCurrent.pdf" isClient={isClient}>Resume [pdf]</HeroA>/
                  <HeroA href="https://medium.com/@chuckdries" isClient={isClient}>Medium (blog)</HeroA>
                </li>
              </ul>
            </div>
          </section>
          <Link
            className={classnames(
              'hover:underline inline-block p-3 px-5 my-3 text-lg rounded-md border-2 arrow-right-after font-bold font-serif',
              isClient && 'text-muted-dark bg-muted-light border-muted-light')} 
            to="/photogallery"
          >
            Photography Gallery</Link>
        </div>
      </div>
    </main>
  </>);
};

export const query = graphql`
{
  allFile(
    filter: {
      sourceInstanceName: {eq: "gallery"},
      # base: {nin: ["DSC01699.jpg", "DSC02981.jpg", "_DSC4155.jpg", "DSC02538.jpg", "DSC05851.jpg"]}
      # no vertical images
      childrenImageSharp: {elemMatch: {fluid: {aspectRatio: {gte: 1.4}}}}
      }
  ) {
    edges {
      node {
        relativePath
        base
        childImageSharp {
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: NONE
            breakpoints: [750, 1080, 1366, 1920, 2560]
          )
          fields {
            imageMeta {
              vibrant {
                ...VibrantColors
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
