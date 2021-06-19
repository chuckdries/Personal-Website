import * as React from 'react';
import { Link, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Helmet } from 'react-helmet';
import { take } from 'ramda';
import classnames from 'classnames';

import { getVibrantToHelmetSafeBodyStyle, getVibrant } from '../utils';
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
  const [imageIndex, setImageIndex] = React.useState(0);
  const images = React.useMemo(() => edges.map((edge) => edge.node), [edges]);
  const image = React.useMemo(() => {
    console.log('ii', imageIndex);
    return images[imageIndex];
  }, [images, imageIndex]);

  const shuffleImage = React.useCallback(() => {
    const lastThreeImages = JSON.parse(localStorage.getItem('lastHeros')) || [];
    const index = getDifferentRand(images.length, lastThreeImages);
    localStorage.setItem('lastHeros', JSON.stringify(take(3, [index, ...lastThreeImages])));
    setImageIndex(index);
  }, [images.length]);

  // pick random image on page hydration
  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
      shuffleImage();
    }
  }, [isClient, imageIndex, shuffleImage]);

  React.useEffect(() => {
    const keyListener = (e) => {
      switch (e.code) {
      case 'ArrowRight': {
        if (imageIndex === images.length - 1) {
          setImageIndex(0);
          return;
        }
        setImageIndex(imageIndex + 1);
        return;
      }

      case 'ArrowLeft': {
        if (imageIndex === 0) {
          setImageIndex(images.length - 1);
          return;
        }
        setImageIndex(imageIndex - 1);
        return;
      }
      }
    };
    document.addEventListener('keydown', keyListener);
    return () => {
      document.removeEventListener('keydown', keyListener);
    };
  }, [imageIndex, images.length]);

  const vibrant = getVibrant(image);
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
          <div>
            <button
              className={classnames(
                'hover:underline inline-block p-3 px-5 my-3 mr-3 text-lg rounded-md border-2 font-bold font-serif',
                isClient && 'text-muted-dark bg-muted-light hover:border-muted border-muted-dark')}
              onClick={shuffleImage} 
              type="button"
            >
              Shuffle <span className="relative" style={{top: '2px'}}><ion-icon name="shuffle"></ion-icon></span>
            </button>
            <Link
              className={classnames(
                'hover:underline inline-block p-3 px-5 my-3 text-lg rounded-md border-2 arrow-right-after font-bold font-serif',
                isClient && 'text-muted-dark bg-muted-light hover:border-muted border-muted-dark')} 
              to="/photogallery"
            >
            Photography Gallery
            </Link>
          </div>
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
      # images that don't work well
      base: {nin: ["DSC06517.jpg"]}
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
