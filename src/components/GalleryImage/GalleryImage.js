import React, { useState } from "react";
import { graphql, navigate, Link } from "gatsby";
import {
  getAspectRatio,
  getMeta,
  getName,
  getShutterFractionFromExposureTime,
  getVibrant,
  getHelmetSafeBodyStyle,
  hasName,
} from "../../utils";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import classnames from "classnames";
import MetadataItem from "./MetadataItem";
import GlobalNav from "../GlobalNav";

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

  const [zoom, setZoom] = useState(false);

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
  const { meta, dateTaken: dt } = getMeta(image);
  // const locationString = meta.City;
  let locationString;
  if (meta.City || meta.State || meta.Location) {
    const location = [meta.Location, meta.City, meta.State].filter(Boolean);
    locationString = location.join(", ");
  }
  const vibrant = getVibrant(image, true);

  const orientationClasses =
    ar > 1
      ? "flex-col mx-auto"
      : "portrait:mx-auto landscape:mx-5 landscape:flex-row-reverse portrait:flex-col";
  const verticalPad = ar > 1 ? "170px" : "70px";

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
          style={getHelmetSafeBodyStyle(vibrant)}
        />
      </Helmet>
      <div className="min-h-screen flex flex-col justify-between">
        <GlobalNav prevImage={pageContext.prevImage} nextImage={pageContext.nextImage} />
        <div className={classnames("flex", orientationClasses)}>
          <div
            className="flex-grow-0 mb-2 overflow-hidden"
            style={{
              maxWidth: zoom
                ? "unset"
                : `calc(max(calc(100vh - ${verticalPad}), 500px) * ${ar})`,
              width: zoom
                ? `max(calc(100vw - 16px), calc(100vh * ${ar}))`
                : "unset",
              // minHeight: zoom ? "100vh" : "unset",
            }}
          >
            <GatsbyImage
              alt={name}
              className={classnames(
                "border-4 border-muted-light",
                zoom ? "cursor-zoom-out" : "cursor-zoom-in"
              )}
              image={getImage(image)}
              key={image.base}
              loading="eager"
              objectFit="contain"
              onClick={() => setZoom((_zoom) => !_zoom)}
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
              <a
                className="cursor-pointer inline-block bg-muted-light text-vibrant-dark font-serif p-1 my-1 rounded"
                download
                href={image.publicURL}
                onClick={() => {
                  try {
                    window.plausible("Download Wallpaper", {
                      props: { image: image.base },
                    });
                  } catch {
                    // do nothing
                  }
                }}
              >
                Download wallpaper
              </a>
            </div>
            {
              <div
                className="portrait:border-t-2 border-muted-light portrait:mt-2 mr-2 portrait:mb-1"
                style={{ width: 30 }}
              ></div>
            }
            <div className="flex flex-col items-end">
              <MetadataItem
                data={dateTaken.toLocaleDateString()}
                icon="calendar-outline"
                title="date taken"
              />
              <div className="flex justify-end gap-2 border border-vibrant-light pl-2 rounded">
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
                <MetadataItem data={meta.ISO} icon="film-outline" title="ISO" />
              </div>
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
          publicURL
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
