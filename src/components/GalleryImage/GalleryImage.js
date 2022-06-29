import React, { useState } from "react";
import { graphql, navigate, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import classnames from "classnames";

import Calendar from "@spectrum-icons/workflow/Calendar";
import Stopwatch from "@spectrum-icons/workflow/Stopwatch";
import Exposure from "@spectrum-icons/workflow/Exposure";
import Filmroll from "@spectrum-icons/workflow/Filmroll";
import Camera from "@spectrum-icons/workflow/Camera";
import Circle from "@spectrum-icons/workflow/Circle";
import Location from "@spectrum-icons/workflow/Location";

import {
  getAspectRatio,
  getMeta,
  getName,
  getShutterFractionFromExposureTime,
  getVibrant,
  getHelmetSafeBodyStyle,
  hasName,
  getCanonicalSize,
} from "../../utils";
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
  const image = data.file;
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
          navigate(`/photogallery/#${image.base}`);
        }
      }
    };
    document.addEventListener("keydown", keyListener);
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  }, [pageContext, image.base]);

  const name = getName(image);
  const { meta, dateTaken: dt } = getMeta(image);
  let locationString;
  if (meta.City || meta.State || meta.Location) {
    const location = [meta.Location, meta.City, meta.State].filter(Boolean);
    locationString = location.join(", ");
  }
  const vibrant = getVibrant(image, true);
  const canonicalSize = getCanonicalSize(image);

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
            to={`/photogallery/#${image.base}`}
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
          <div
            className={classnames(
              zoom ? "cursor-zoom-out" : "cursor-zoom-in",
              "mb-2"
            )}
            onClick={() => setZoom((_zoom) => !_zoom)}
            style={{
              maxWidth: `calc(max(calc(100vh - ${verticalPad}), 500px) * ${ar})`,
            }}
          >
            {zoom ? (
              <img
                alt={name}
                src={image.publicURL}
                style={{
                  maxWidth: "unset",
                }}
              />
            ) : (
              <GatsbyImage
                alt={name}
                className="border-4 border-vibrant"
                image={getImage(image)}
                key={image.base}
                loading="eager"
                objectFit="contain"
              />
            )}
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
                icon={<Calendar />}
                title="date taken"
              />
              <div className="flex justify-end gap-2 border border-vibrant-light pl-2 rounded">
                <MetadataItem
                  data={shutterSpeed}
                  icon={<Stopwatch />}
                  title="shutter speed"
                />
                {meta.FNumber && (
                  <MetadataItem
                    data={`f/${meta.FNumber}`}
                    icon={<Exposure />}
                    title="aperture"
                  />
                )}
                <MetadataItem data={meta.ISO} icon={<Filmroll />} title="ISO" />
              </div>
              <MetadataItem
                data={locationString}
                icon={<Location />}
                title="location"
              />
              {(meta.Make || meta.Model) && (
                <MetadataItem
                  data={[meta.Make, meta.Model].join(" ")}
                  icon={<Camera />}
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
                  icon={<Circle />}
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
    file(base: { eq: $imageFilename }) {
      base
      publicURL
      childImageSharp {
        fluid {
          aspectRatio
        }
        gatsbyImageData(
          layout: CONSTRAINED
          placeholder: DOMINANT_COLOR
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
`;

export default GalleryImage;
