import * as React from 'react';
import { Link, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Helmet } from 'react-helmet';
import { take } from 'ramda';
import classnames from 'classnames';
import posthog from 'posthog-js';

import { getVibrantToHelmetSafeBodyStyle, getVibrant, getAspectRatio } from '../utils';
import { HeroA } from '../components/Index/HeroLink';

// TODO: better text colors in situations of low contrast

const env = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';

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

  const shuffleImage = React.useCallback((currentImage) => {
    const lastThreeImages = JSON.parse(localStorage.getItem('lastHeros')) || [];
    if (env === 'production') {
      try {
        // eslint-disable-next-line
        posthog.capture('[shuffle image]', { currentImage: currentImage?.base });
      } catch (e) {/* do nothing */}
    }
    const index = getDifferentRand(images.length, lastThreeImages);
    localStorage.setItem('lastHeros', JSON.stringify(take(3, [index, ...lastThreeImages])));
    setImageIndex(index);
  }, [images.length]);

  // pick random image on page hydration
  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
      shuffleImage(image);
    }
  }, [isClient, imageIndex, image, shuffleImage]);

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
  const ar = getAspectRatio(image);
  return (<>
    <Helmet>
      <title>Chuck Dries</title>
      <body
        className={classnames(isClient ? 'bg-vibrant-dark' : '')}
        style={getVibrantToHelmetSafeBodyStyle(vibrant)}
      />
    </Helmet>
    {/* WIP: ipad portrait hits md breakpoint, looks bad */}
    <main
      className={classnames('font-serif hero', ar > 1 || !isClient
        ? 'landscape:grid portrait:flex portrait:flex-col' : 'portrait:grid landscape:flex landscape:flex-row-reverse')}
    >
      {isClient ? 
        <GatsbyImage
          alt=""
          className={classnames(
            ar > 1 || !isClient ? 'landscape:h-screen portrait:h-two-thirds-vw' : 'h-screen portrait:w-full landscape:w-1/2',
          )}
          image={getImage(image)}
          loading="eager"
          style={{
            gridArea: '1/1',
          }} />
        // 67vw = 1/1.49253731 = 1/aspect ratio of my camera lol
        : <div className="landscape:h-screen portrait:h-two-thirds-vw w-full" style={{gridArea: '1/1' }}></div> }
      <div className="relative grid place-items-center" style={{gridArea: '1/1'}}>
        <div className="m-0 sm:m-3 flex flex-col items-end">
          <section className={classnames('md:px-6 px-4 rounded-t-lg md:py-5 py-3', isClient && 'border-b-2 border-vibrant-light bg-vibrant-dark-75')}>
            <div className="mx-auto">
              <h1 className={classnames('font-black text-4xl sm:text-5xl md:text-6xl', isClient && 'text-vibrant-light')}>Chuck Dries</h1>
              <h2 className={classnames('text-xl md:text-2xl', isClient && 'text-vibrant')}>Full stack software engineer &amp; hobbyist photographer</h2>
              {<div className="border-t-2 border-muted-light mt-2 mr-2 mb-1" style={{width: 30}}></div>}

              <ul className={classnames(isClient && 'text-muted-light')}>
                <li>Software Engineer, Axosoft</li>
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
          <div className="flex">
            <div className="flex items-center flex-col">
              <Link
                className={classnames(
                  'hover:underline inline-block px-1 my-1 mr-2 text-md rounded-md border-2',
                  isClient && 'text-vibrant-dark bg-vibrant hover:border-muted border-vibrant-dark')} 
                // style={{top: '5px'}}
                id="image-link"
                title="view image details"
                to={`/photogallery/${image.base}/`}
              >
                <span className="icon-offset"><ion-icon name="expand"></ion-icon></span>
              </Link>
              <button
                className={classnames(
                  'hover:underline inline-block px-1 my-1 mr-2 text-md rounded-md border-2',
                  isClient && 'text-vibrant-dark bg-vibrant hover:border-muted border-vibrant-dark')}
                id="shuffle-button"
                onClick={() => {
                  shuffleImage(image);
                }}
                title="shuffle image"
                type="button"
              >
                <span className="icon-offset"><ion-icon name="shuffle"></ion-icon></span>
              </button>
            </div>
            <Link
              className={classnames(
                'hover:underline p-3 px-5 py-4 text-md sm:text-lg rounded-b-md border-2 border-l-2 border-r-2 arrow-right-after font-bold font-serif',
                isClient && 'text-vibrant-dark bg-vibrant hover:border-muted border-vibrant-dark')} 
              id="photogallery-link"
              to="/photogallery/"
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
      # base: {nin: ["DSC06517.jpg"]}
      # childrenImageSharp: {elemMatch: {fluid: {aspectRatio: {lte: 1.3}}}}
      }
  ) {
    edges {
      node {
        relativePath
        base
        childImageSharp {
          fluid {
            aspectRatio
          }
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
