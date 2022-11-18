import React, { useState, useEffect } from "react";
import { graphql, navigate, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import classnames from "classnames";

import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
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
  getGalleryPageUrl,
} from "../../utils";
import MetadataItem from "./MetadataItem";
import Nav from "../Nav";

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

const IconStyle = {
  width: '24px',
  margin: '0 4px'
}

const ArrowLinkClasses = `hover:underline text-vibrant-light hover:text-muted-light 
lg:px-4 self-stretch flex items-center hover:bg-black/50 max-h-screen sticky top-0
`;

const GalleryImage = ({ data, location: { state } }) => {
  const { sortedImageList, currentIndex, filterKeyword, sortKey } = state ?? {};
  const image = data.file;
  const ar = getAspectRatio(image);

  const [zoom, setZoom] = useState(false);
  const [isClient, setIsClient] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const nextIndex =
    sortedImageList && currentIndex < sortedImageList.length
      ? currentIndex + 1
      : null;
  const prevIndex =
    sortedImageList && currentIndex > 0 ? currentIndex - 1 : null;

  const nextImage = sortedImageList && sortedImageList[nextIndex];
  const prevImage = sortedImageList && sortedImageList[prevIndex];

  React.useEffect(() => {
    const keyListener = (e) => {
      switch (e.code) {
        case "ArrowRight": {
          logKeyShortcut(e.code);
          if (nextImage) {
            navigate(`/photogallery/${nextImage}/`, {
              state: {
                currentIndex: currentIndex + 1,
                sortedImageList,
                filterKeyword,
                sortKey,
              },
            });
          }
          return;
        }
        case "ArrowLeft": {
          logKeyShortcut(e.code);
          if (prevImage) {
            navigate(`/photogallery/${prevImage}/`, {
              state: {
                currentIndex: currentIndex - 1,
                sortedImageList,
                filterKeyword,
                sortKey,
              },
            });
          }
          return;
        }
        case "Escape":
        case "KeyG": {
          logKeyShortcut(e.code);
          navigate(
            getGalleryPageUrl({ keyword: filterKeyword, sortKey }, image.base)
          );
        }
      }
    };
    document.addEventListener("keydown", keyListener);
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  }, [
    nextImage,
    prevImage,
    image.base,
    currentIndex,
    sortedImageList,
    filterKeyword,
    sortKey,
  ]);

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
      ? "flex-col"
      : "portrait:mx-auto landscape:mx-5 landscape:flex-row-reverse portrait:flex-col";
  const verticalPad = ar > 1 ? "250px" : "100px";

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
      <div className="min-h-screen flex flex-col justify-between overflow-x-hidden">
        <Nav
          className="mb-4"
          internalLinks={[
            { href: "/", label: "Home" },
            {
              href: getGalleryPageUrl(
                { keyword: filterKeyword, sortKey },
                image.base
              ),
              label: (
                <>
                  Gallery <kbd className="font-normal">esc</kbd>
                </>
              ),
            },
          ]}
          isClient={isClient}
        />
        <div className="flex flex-auto items-center lg:gap-2 justify-between">
          {prevImage ? (
            <Link
              className={ArrowLinkClasses}
              state={{
                currentIndex: currentIndex - 1,
                sortedImageList,
                filterKeyword,
                sortKey,
              }}
              to={`/photogallery/${prevImage}/`}
            >
              <span className="p-1 lg:p-4 bg-muted-light/25 rounded-full">
                <ChevronLeft UNSAFE_style={IconStyle} />
              </span>
            </Link>
          ) : (
            <div></div>
          )}
          <div className={classnames("pb-2 flex", orientationClasses)}>
            <div
              className={classnames(
                // zoom ? "cursor-zoom-out" : "cursor-zoom-in",
                "mb-2 self-center"
              )}
              // onClick={() => setZoom((_zoom) => !_zoom)}
              style={{
                maxWidth: `calc(max(calc(100vh - ${verticalPad}), 500px) * ${ar})`,
              }}
            >
              {zoom ? (
                <img
                  alt={name}
                  src={image.publicURL}
                  style={{
                    width: canonicalSize.width / window.devicePixelRatio,
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
                  : "landscape:container portrait:pt-5 portrait:flex-col portrait:text-right"
              )}
            >
              <div className="flex-auto mr-2">
                <p className="text-muted-light font-mono text-sm m-0 mt-1">
                  {image.base}
                </p>
                {hasName(image) && (
                  <h1 className="text-4xl mt-0 font-sans">{name}</h1>
                )}
                <p className="landscape:mr-2">{meta.Caption}</p>
                <a
                  className="cursor-pointer inline-block bg-muted-light text-vibrant-dark font-sans p-1 my-1 rounded"
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
                  icon={<Calendar UNSAFE_style={IconStyle} />}
                  title="date taken"
                />
                <div className="sm:flex justify-end gap-2 border border-vibrant-light pl-2 rounded">
                  <MetadataItem
                    data={shutterSpeed}
                    icon={<Stopwatch UNSAFE_style={IconStyle} />}
                    title="shutter speed"
                  />
                  {meta.FNumber && (
                    <MetadataItem
                      data={`f/${meta.FNumber}`}
                      icon={<Exposure UNSAFE_style={IconStyle} />}
                      title="aperture"
                    />
                  )}
                  <MetadataItem
                    data={meta.ISO}
                    icon={<Filmroll UNSAFE_style={IconStyle} />}
                    title="ISO"
                  />
                </div>
                <MetadataItem
                  data={locationString}
                  icon={<Location UNSAFE_style={IconStyle} />}
                  title="location"
                />
                {(meta.Make || meta.Model) && (
                  <MetadataItem
                    data={[meta.Make, meta.Model].join(" ")}
                    icon={<Camera UNSAFE_style={IconStyle} />}
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
                    icon={<Circle UNSAFE_style={IconStyle} />}
                    title="lens"
                  />
                )}
              </div>
            </div>
          </div>
          {nextImage ? (
            <Link
              className={ArrowLinkClasses}
              state={{
                currentIndex: currentIndex + 1,
                sortedImageList,
                filterKeyword,
                sortKey,
              }}
              to={`/photogallery/${nextImage}/`}
            >
              <span className="p-1 lg:p-4 bg-muted-light/25 rounded-full">
                <ChevronRight UNSAFE_style={IconStyle} />
              </span>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
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
            # Location
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
