import React, { useState, useEffect } from "react";
import { graphql, navigate, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import classnames from "classnames";
import chroma, { Color } from "chroma-js";

import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import Calendar from "@spectrum-icons/workflow/Calendar";
import Stopwatch from "@spectrum-icons/workflow/Stopwatch";
import Exposure from "@spectrum-icons/workflow/Exposure";
import Filmroll from "@spectrum-icons/workflow/Filmroll";
import Dolly from "@spectrum-icons/workflow/Dolly";
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
  getVibrantStyle,
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
  width: "24px",
  margin: "0 4px",
};

const ArrowLinkClasses = `text-black hover:backdrop-blur opacity-50 hover:opacity-100
px-4 flex items-center hover:bg-black/20 max-h-screen z-10 hover-none:pt-2
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

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 190,
        behavior: "smooth",
      });
    }, 50);
  }, [image.base]);

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
  const vibrant = getVibrant(image);
  const BLEND = "hsl";
  const darkAccent = chroma
    .mix(vibrant.Vibrant, "hsla(216, 0%, 90%, 1)", 0.6, BLEND)
    .hex();
  const canonicalSize = getCanonicalSize(image);

  const orientationClasses =
    ar > 1
      ? "flex-col"
      : "portrait:mx-auto landscape:mx-5 landscape:flex-row-reverse portrait:flex-col";
  const verticalPad = ar > 1 ? "180px" : "20px";

  const shutterSpeed = React.useMemo(
    () =>
      meta.ExposureTime
        ? getShutterFractionFromExposureTime(meta.ExposureTime)
        : null,
    [meta]
  );
  const dateTaken = React.useMemo(() => new Date(dt), [dt]);
  return (
    <>
      <Helmet>
        <title>{name} - Gallery | Chuck Dries</title>
        <body
          className="text-white transition-colors"
          // style={getHelmetSafeBodyStyle(vibrant)}
          style={getHelmetSafeBodyStyle({
            ...getVibrantStyle(vibrant),
            background: chroma
              .mix(vibrant.DarkVibrant, "black", 0.6, BLEND)
              .hex(),
          })}
        />
      </Helmet>
      <div className="min-h-screen flex flex-col justify-between overflow-x-hidden">
        <Nav
          className="mb-4"
          internalLinks={[
            { href: "/", label: "Home" },
            { href: "/projects", label: "Projects"},
            {
              href: getGalleryPageUrl(
                { keyword: filterKeyword, sortKey },
                image.base
              ),
              label: (
                <>
                  Gallery{" "}
                  <kbd
                    className="font-normal"
                    style={{ background: darkAccent }}
                  >
                    esc
                  </kbd>
                </>
              ),
            },
          ]}
          isClient={isClient}
          scheme="dark"
        />
        <div className="flex flex-auto items-center justify-center">
          <div className={classnames("pb-2 flex", orientationClasses)}>
            <div
              className={classnames(
                // zoom ? "cursor-zoom-out" : "cursor-zoom-in",
                "mb-2 self-center relative flex hover-none:flex-col-reverse"
              )}
              // onClick={() => setZoom((_zoom) => !_zoom)}
              style={{
                maxWidth: `calc(max(calc(100vh - ${verticalPad}), 500px) * ${ar})`,
              }}
            >
              <div
                className={classnames(
                  "hover-hover:absolute",
                  "hover-hover:top-0 hover-hover:bottom-0 hover-hover:left-0 hover-hover:right-0",
                  "hover-hover:opacity-0 hover:opacity-100 focus-within:opacity-100",
                  "z-10 flex justify-between"
                )}
              >
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
                    <span
                      className="p-4 rounded-full backdrop-blur"
                      style={{
                        background: darkAccent,
                      }}
                    >
                      <ChevronLeft UNSAFE_style={IconStyle} />
                    </span>
                  </Link>
                ) : (
                  <div></div>
                )}
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
                    <span
                      className="p-4 rounded-full"
                      style={{
                        background: darkAccent,
                      }}
                    >
                      <ChevronRight UNSAFE_style={IconStyle} />
                    </span>
                  </Link>
                ) : (
                  <div></div>
                )}
              </div>
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
                  className="shadow-md"
                  image={getImage(image)}
                  key={image.base}
                  loading="eager"
                  objectFit="contain"
                />
              )}
            </div>
            <div
              className={classnames(
                "px-2 flex  mx-auto",
                ar <= 1
                  ? "pt-5 flex-col flex-auto text-right items-end"
                  : "flex-row landscape:container portrait:pt-5 portrait:flex-col portrait:text-right portrait:items-end"
              )}
            >
              <div className="mr-2 flex flex-col">
                <p className="font-mono text-sm m-0 mt-1">{image.base}</p>
                {hasName(image) && (
                  <h1 className="text-4xl mt-0 font-sans">{name}</h1>
                )}
                <p className="landscape:mr-2">{meta.Caption}</p>
                <div
                  className={classnames(
                    "grid grid-cols-6 h-[40px] w-[240px]",
                    ar <= 1 ? "self-end" : "portrait:self-end"
                  )}
                >
                  <div
                    style={{ background: `rgba(${vibrant.Vibrant.join(",")})` }}
                  ></div>
                  <div
                    style={{
                      background: `rgb(${vibrant.LightVibrant.join(",")})`,
                    }}
                  ></div>
                  <div
                    style={{
                      background: `rgb(${vibrant.DarkVibrant.join(",")})`,
                    }}
                  ></div>
                  <div
                    style={{ background: `rgb(${vibrant.Muted.join(",")})` }}
                  ></div>
                  <div
                    style={{
                      background: `rgb(${vibrant.LightMuted.join(",")})`,
                    }}
                  ></div>
                  <div
                    style={{
                      background: `rgb(${vibrant.DarkMuted.join(",")})`,
                    }}
                  ></div>
                </div>
                <div className="my-2">
                  <a
                    className="cursor-pointer text-black font-sans p-1 rounded"
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
                    style={{
                      background: darkAccent,
                    }}
                  >
                    Download wallpaper
                  </a>
                </div>
              </div>
              <div className="flex-auto"></div>
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
                <div className="sm:flex justify-end gap-2 border border-gray-500 pl-2 rounded">
                  <MetadataItem
                    data={shutterSpeed}
                    icon={<Stopwatch UNSAFE_style={IconStyle} />}
                    title="shutter"
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
                  <MetadataItem
                    data={meta.FocalLength ? meta.FocalLength + "mm" : null}
                    icon={<Dolly UNSAFE_style={IconStyle} />}
                    title="focal"
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
                    data={meta.LensModel === "----" ? null : meta.LensModel}
                    icon={<Circle UNSAFE_style={IconStyle} />}
                    title="lens"
                  />
                )}
              </div>
            </div>
          </div>
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
            Location
            City
            State
            Keywords
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
