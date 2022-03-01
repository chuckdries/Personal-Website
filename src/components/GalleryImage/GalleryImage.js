import React from "react";
import { graphql, navigate, Link } from "gatsby";
import {
  getAspectRatio,
  getMeta,
  getName,
  getShutterFractionFromExposureTime,
  getVibrant,
  getVibrantToHelmetSafeBodyStyle,
  hasName,
} from "../../utils";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import classnames from "classnames";
import MetadataItem from "./MetadataItem";

const logKeyShortcut = (keyCode) => {
  try {
    // eslint-disable-next-line
    window.plausible("KeyShortcut", { props: { keyCode } });
    // eslint-disable-next-line
    _paq.push(["trackEvent", "GalleryImage", "KeyShortcut", keyCode]);
  } catch (e) {
    /* do nothing */
  }
};

const GalleryImage = ({ data, pageContext }) => {
  const image = data.allFile.edges[0].node;
  const ar = getAspectRatio(image);

  React.useEffect(() => {
    const keyListener = (e) => {
      switch (e.code) {
        case "ArrowRight": {
          logKeyShortcut(e.code);
          if (pageContext.nextImage) {
            navigate(`/photogallery/${pageContext.nextImage}/`);
          }
          return;
        }
        case "ArrowLeft": {
          logKeyShortcut(e.code);
          if (pageContext.prevImage) {
            navigate(`/photogallery/${pageContext.prevImage}/`);
          }
          return;
        }
        case "Escape":
        case "KeyG": {
          logKeyShortcut(e.code);
          navigate("/photogallery/");
        }
      }
    };
    document.addEventListener("keydown", keyListener);
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  }, [pageContext]);

  const name = getName(image);
  const {meta, dateTaken: dt} = getMeta(image);
  // const locationString = meta.City;
  let locationString;
  if (meta.City || meta.State || meta.Location) {
    const location = [meta.Location, meta.City, meta.State].filter(
      Boolean
    );
    locationString = location.join(", ");
  }
  const vibrant = getVibrant(image, true);

  const orientationClasses =
    ar > 1
      ? "flex-col mx-auto"
      : "portrait:mx-auto landscape:mx-5 landscape:flex-row-reverse portrait:flex-col";
  const shutterSpeed = React.useMemo(
    () => getShutterFractionFromExposureTime(meta.ExposureTime || 0),
    [meta]
  );
  const dateTaken = React.useMemo(() => new Date(dt), [dt]);
  return (
    <>
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
          >
            back
          </button>
          <Link
            className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
            to="/"
          >
            home
          </Link>
          <Link
            className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
            to="/photogallery/"
          >
            gallery <span className="bg-gray-300 text-black">esc</span>
          </Link>
          {pageContext.prevImage && (
            <Link
              className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
              to={`/photogallery/${pageContext.prevImage}/`}
            >
              previous <span className="bg-gray-300 text-black">&#11104;</span>
            </Link>
          )}
          {pageContext.nextImage && (
            <Link
              className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
              to={`/photogallery/${pageContext.nextImage}/`}
            >
              next <span className="bg-gray-300 text-black">&#11106;</span>
            </Link>
          )}
        </nav>
        <div className={classnames("flex", orientationClasses)}>
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
                maxHeight: "90vh",
                // minHeight: '500px',
              }}
            />
          </div>
          <div
            className={classnames(
              "px-2 flex flex-row portrait:items-end mx-auto",
              ar <= 1
                ? "pt-5 flex-col flex-auto text-right"
                : "container portrait:pt-5 portrait:flex-col portrait:text-right"
            )}
          >
            <div className="flex-auto mr-2">
              <p className="text-muted-light font-mono text-sm m-0 mt-1">
                {image.base}
              </p>
              {hasName(image) && (
                <h1 className="text-4xl mt-0 font-serif">{name}</h1>
              )}
              <p className="landscape:mr-2">{meta.Caption}</p>
            </div>
            {
              <div
                className="portrait:border-t-2 border-muted-light portrait:mt-2 mr-2 portrait:mb-1"
                style={{ width: 30 }}
              ></div>
            }
            <div className='flex flex-col'>
              <MetadataItem
                data={dateTaken.toLocaleDateString()}
                icon="calendar-outline"
                title="date taken"
              />
              <MetadataItem
                data={locationString}
                icon="map-outline"
                title="location"
              />
              {(meta.Make || meta.Model) && (
                <MetadataItem
                  data={[meta.Make, meta.Model].join(" ")}
                  icon="camera-outline"
                  title="camera"
                />
              )}
              {(meta.LensModel || meta.FocalLength) && (
                <MetadataItem
                  data={[
                    meta.LensModel === "----" ? null : meta.LensModel,
                    meta.FocalLength && `${meta.FocalLength}mm`,
                  ]
                    .filter(Boolean)
                    .join(" @")}
                  icon="ellipse"
                  title="lens"
                />
              )}
              <MetadataItem
                data={shutterSpeed}
                icon="stopwatch-outline"
                title="shutter speed"
              />
              {meta.FNumber && (
                <MetadataItem
                  data={`f/${meta.FNumber}`}
                  icon="aperture-outline"
                  title="aperture"
                />
              )}
              <MetadataItem
                data={meta.ISO}
                icon="film-outline"
                title="ISO"
              />
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export const query = graphql`
  query GalleryImage($imageFilename: String) {
    allFile(
      filter: {
        sourceInstanceName: { eq: "gallery" }
        base: { eq: $imageFilename }
      }
    ) {
      edges {
        node {
          base
          childImageSharp {
            fluid {
              aspectRatio
            }
            gatsbyImageData(
              layout: CONSTRAINED
              # placeholder: BLURRED
              placeholder: DOMINANT_COLOR
              # placeholder: TRACED_SVG
              height: 2160
              quality: 90
            )
          }
          fields {
            imageMeta {
              dateTaken
              meta {
                Make
                Model
                ExposureTime
                FNumber
                ISO
                DateTimeOriginal
                CreateDate
                ShutterSpeedValue
                ApertureValue
                FocalLength
                LensModel
                ObjectName
                Caption
                Location
                City
                State
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
`;

export default GalleryImage;
