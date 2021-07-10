import React from 'react';
import { graphql, navigate, Link } from 'gatsby';
import {
  getAspectRatio,
  getMeta,
  getName,
  getShutterFractionFromExposureTime,
  getVibrant,
  getVibrantToHelmetSafeBodyStyle,
  hasName,
} from '../../utils';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import posthog from 'posthog-js';
import MetadataItem from './MetadataItem';

const logKeyShortcut = (keyCode) => {
  try {
    // eslint-disable-next-line
    posthog.capture('[key shortcut]', { keyCode });
    window.plausible('KeyShortcut', {props: { keyCode }});
  } catch (e) {/* do nothing */}
};

const GalleryImage = ({ data, pageContext }) => {
  const image = data.allFile.edges[0].node;
  const ar = getAspectRatio(image);

  React.useEffect(() => {
    const keyListener = (e) => {
      
      switch (e.code) {
      case 'ArrowRight': {
        logKeyShortcut(e.code);
        if (pageContext.nextImage) {
          navigate(`/photogallery/${pageContext.nextImage}/`);
        }
        return;
      }
      case 'ArrowLeft': {
        logKeyShortcut(e.code);
        if (pageContext.prevImage) {
          navigate(`/photogallery/${pageContext.prevImage}/`);
        }
        return;
      }
      case 'Escape':
      case 'KeyG': {
        logKeyShortcut(e.code);
        navigate('/photogallery/');
      }
      }
    };
    document.addEventListener('keydown', keyListener);
    return () => {
      document.removeEventListener('keydown', keyListener);
    };
  }, [pageContext]);

  const name = getName(image);
  const meta = getMeta(image);
  let locationString;
  if (meta.iptc.city || meta.iptc.province_or_state) {
    const location = [meta.iptc.city, meta.iptc.province_or_state].filter(Boolean);
    locationString = location.join(', ');
  }
  const vibrant = getVibrant(image, true);

  const orientationClasses = ar > 1 ? 'flex-col mx-auto' : 'portrait:mx-auto landscape:mx-5 landscape:flex-row-reverse portrait:flex-col';
  console.log(ar, orientationClasses);
  const shutterSpeed = React.useMemo(() => getShutterFractionFromExposureTime(meta.exif.ExposureTime || 0), [meta]);
  const dateTaken = React.useMemo(() => new Date(meta.dateTaken), [meta]);
  return (<>
    <Helmet>
      <title>{name} - Gallery | Chuck Dries</title>
      <body
        className="text-vibrant-light bg-vibrant-dark"
        style={getVibrantToHelmetSafeBodyStyle(vibrant)}
      />
    </Helmet>
    <div className="min-h-screen flex flex-col justify-between">
      <nav className="mt-1 ml-1 text-lg mb-4">
        <button
          className="hover:underline text-vibrant-light hover:text-muted-light arrow-left-before  mr-1"
          onClick={() => navigate(-1)}
          type="button"
        >back</button>
        <Link
          className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
          to="/"
        >home</Link>
        <Link
          className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
          to="/photogallery/"
        >gallery <span className="bg-gray-300 text-black">esc</span></Link>
        {pageContext.prevImage && <Link
          className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
          to={`/photogallery/${pageContext.prevImage}/`}
        >previous <span className="bg-gray-300 text-black">&#11104;</span></Link>}
        {pageContext.nextImage && <Link
          className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
          to={`/photogallery/${pageContext.nextImage}/`}
        >next <span className="bg-gray-300 text-black">&#11106;</span></Link>}
      </nav>
      <div className={classnames('flex', orientationClasses)}>
        <div className="flex-grow-0">
          <GatsbyImage
            alt={name}
            className=""
            image={getImage(image)}
            key={image.base}
            loading="eager"
            objectFit="contain"
            style={{
              maxWidth: `calc(max(90vh, 500px) * ${ar})`,
              maxHeight: '90vh',
              // minHeight: '500px',
            }} />
        </div>
        <div className={classnames(
          'flex-shrink-0 mx-2 flex flex-row portrait:items-end', ar <= 1
            ? 'pt-5 flex-col flex-auto text-right'
            : 'portrait:pt-5 portrait:flex-col portrait:text-right'
        )}>
          <div className="flex-auto mr-2">
            <p className="text-muted-light font-mono text-sm m-0 mt-1">{image.base}</p>
            {hasName(image) && <h1 className="text-4xl mt-0 font-serif">{name}</h1>}
            <p className="landscape:mr-2">{meta.iptc.caption}</p>
          </div>
          {<div className="portrait:border-t-2 border-muted-light portrait:mt-2 mr-2 portrait:mb-1" style={{width: 30}}></div>}
          <MetadataItem aspectRatio={ar} data={dateTaken.toLocaleDateString()} icon="calendar-sharp" title="date taken"/>
          <MetadataItem aspectRatio={ar} data={locationString} icon="location-sharp" title="location"/>
          <MetadataItem aspectRatio={ar} data={shutterSpeed} icon="stopwatch-sharp" title="shutter speed" />
          <MetadataItem aspectRatio={ar} data={`f/${meta.exif.FNumber}`} icon="aperture-sharp" title="aperture" />
          <MetadataItem aspectRatio={ar} data={meta.exif.ISO} icon="film-outline" title="ISO" />
        </div>
      </div>
      <div></div>
    </div>
  </>);
};

export const query = graphql`
  query GalleryImage($imageFilename: String) {
  allFile(filter: {sourceInstanceName: {eq: "gallery"}, base: {eq: $imageFilename}}) {
    edges {
      node {
        base
        childImageSharp{
          fluid {
            aspectRatio
          }
          gatsbyImageData(
            layout: CONSTRAINED
            # placeholder: BLURRED
            placeholder: DOMINANT_COLOR
            # placeholder: TRACED_SVG
            height: 2160
          )
          fields {
            imageMeta {
              dateTaken
              iptc {
                caption
                object_name
                keywords
                city
                province_or_state
              }
              exif {
                FNumber
                ExposureTime
                ISO
              }
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

export default GalleryImage;
