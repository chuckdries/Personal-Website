import { Link, PageProps, graphql, navigate } from "gatsby";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { PhotoLayout } from "../PhotoLayout";
import { GatsbyImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import Nav from "../../Nav";
import {
  getHelmetSafeBodyStyle,
  getMeta,
  getShutterFractionFromExposureTime,
  getVibrantStyle,
} from "../../../utils";
import MetadataItem from "../MetadataItem";

import "./PhotoImage.css";

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
import { slice } from "ramda";
import { OverlayNavArrow } from "./OverlayNavArrow";
import { NavArrowOverlay } from "./NavArrowOverlay";

const IconStyle = {
  width: "24px",
  margin: "0 4px",
};

export interface SiblingLocationState {
  context: string[];
  selfIndex: number;
}

export interface SiblingNavData {
  next: string;
  state: SiblingLocationState;
}

function getLeftNavData({
  context,
  selfIndex,
}: SiblingLocationState): SiblingNavData | null {
  if (selfIndex < 1) {
    return null;
  }
  const nextSelf = selfIndex - 1;
  const next = context[nextSelf];
  return {
    next: `/${next}`,
    state: {
      context,
      selfIndex: nextSelf,
    },
  };
}

function getRightNavData({
  context,
  selfIndex,
}: SiblingLocationState): SiblingNavData | null {
  if (selfIndex >= context.length - 1) {
    return null;
  }
  const nextSelf = selfIndex + 1;
  const next = context[nextSelf];
  return {
    next: `/${next}`,
    state: {
      context,
      selfIndex: nextSelf,
    },
  };
}

export interface SiblingNavDatas {
  left: SiblingNavData | null;
  right: SiblingNavData | null;
}

function getSiblingDatas(_state: SiblingLocationState): SiblingNavDatas {
  return {
    left: getLeftNavData(_state),
    right: getRightNavData(_state),
  };
}

function nav(
  { left, right }: SiblingNavDatas,
  direction: "ArrowLeft" | "ArrowRight",
) {
  const to = direction === "ArrowLeft" ? left : right;
  if (!to) {
    return;
  }
  const { next, state } = to;
  navigate(next, {
    state,
    // replace: true,
  });
}

const FilmstockKeywords = [
  "Cinestill 50D",
  "Ektar 100",
  "Kodak Gold 200",
  "Gold 200",
  "Ektachrome E100",
  "Instax Square",
  "Portra 400",
];

const smoothScrollSupported =
  typeof window !== "undefined" &&
  window.document &&
  "scrollBehavior" in document.documentElement.style;

function PhotoImage({
  pageContext,
  data,
  location,
}: PageProps<Queries.PhotoImageQuery, { imageId: string }>) {
  const siblingNavDatas =
    (location.state as SiblingLocationState)?.context &&
    (location.state as SiblingLocationState)?.selfIndex !== undefined
      ? getSiblingDatas(location.state as SiblingLocationState)
      : null;

  const imageRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const scroll = () => {
      const imgHeight = imageRef.current?.clientHeight ?? 0;
      window.scrollTo({
        top:
          (imageRef.current?.offsetTop ?? 0) -
          (window.innerHeight - imgHeight) / 2,
        behavior: "smooth",
      });
    };
    if (smoothScrollSupported) {
      setTimeout(scroll, 60);
    } else {
      scroll();
    }
  }, [data.image?.base]);

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/photos");
      }
      switch (e.code) {
        case "ArrowLeft":
        case "ArrowRight":
          if (siblingNavDatas) {
            nav(siblingNavDatas, e.code);
            break;
          }
      }
    };
    document.addEventListener("keydown", keyListener);
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  }, [siblingNavDatas]);

  const image = data.image!;
  const { meta, dateTaken: dt } = image.fields!.imageMeta!;

  const shutterSpeed = React.useMemo(
    () =>
      meta?.ExposureTime
        ? getShutterFractionFromExposureTime(meta.ExposureTime)
        : null,
    [meta],
  );
  const dateTaken = React.useMemo(() => (dt ? new Date(dt) : null), [dt]);

  const film = React.useMemo(
    () => meta?.Make === "NORITSU KOKI" || meta?.Keywords?.includes("Film"),
    [meta],
  );
  const filmStock = React.useMemo(
    () =>
      film
        ? meta?.Keywords?.find((k) => k && FilmstockKeywords.includes(k))
        : null,
    [],
  );
  return (
    <div className="min-h-screen p-0">
      <Helmet>
        <title>Photos | Chuck Dries</title>
        <body
          className="bg-white text-black"
          // @ts-expect-error not a style prop
          style={getHelmetSafeBodyStyle({
            "--dark-vibrant": `255, 255, 255`,
          })}
        />
      </Helmet>
      <Nav className="mb-0" scheme="light" />
      {/* <div className="flex-auto "> */}
      <div className="mx-auto relative max-w-[90vw]" ref={imageRef}>
        <GatsbyImage
          alt="photo"
          className="max-h-[90vh] big-blur"
          id="photo"
          image={data.image!.childImageSharp!.gatsbyImageData}
          objectFit="contain"
          objectPosition="middle"
          style={{
            "--img-src": `url('${data.image!.childImageSharp!.gatsbyImageData.images.fallback!.src}')`,
          }}
        />
        {siblingNavDatas && (
          <NavArrowOverlay siblingNavDatas={siblingNavDatas} />
        )}
      </div>
      <div className="flex justify-center flex-col sm:flex-row p-6">
        <div className="px-4">
          <div className="flex flex-col items-end gap-2">
            {dateTaken && (
              <MetadataItem
                data={dateTaken.toLocaleDateString()}
                icon={<Calendar UNSAFE_style={IconStyle} />}
                title={film ? "date scanned" : "date taken"}
              />
            )}
            {film && (
              <MetadataItem
                data={filmStock ?? "-"}
                icon={<Filmroll UNSAFE_style={IconStyle} />}
                title={"filmstock"}
              />
            )}
            {!film && (
              <>
                {meta &&
                  (shutterSpeed ||
                    meta.FNumber ||
                    meta.ISO ||
                    meta.FocalLength) && (
                    <div className="flex flex-wrap justify-end gap-2 bg-gray-500/20 py-3 pl-4 rounded">
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
                  )}
                {/* <MetadataItem
            data={locationString}
            icon={<Location UNSAFE_style={IconStyle} />}
            title="location"
          /> */}
                {(meta?.Make || meta?.Model) && (
                  <MetadataItem
                    data={[meta?.Make, meta?.Model].join(" ")}
                    icon={<Camera UNSAFE_style={IconStyle} />}
                    title="camera"
                  />
                )}
                {(meta?.LensModel || meta?.FocalLength) && (
                  <MetadataItem
                    data={meta?.LensModel === "----" ? null : meta?.LensModel}
                    icon={<Circle UNSAFE_style={IconStyle} />}
                    title="lens"
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="justify-self-stretch border border-black border-opacity-10 my-4" />
        <div className="px-4 text-right sm:text-left">
          <p className="font-mono text-sm mr-2 mb-4">{image.base}</p>
          <a
            className="cursor-pointer inline-block text-center font-sans mr-2 px-3 py-2 rounded text-white border-2 border-blue-500 bg-blue-600 hover:bg-blue-500 hover:border-blue-400 transition-colors"
            download
            href={data.image!.publicURL!}
            onClick={() => {
              try {
                window.plausible("Download Wallpaper", {
                  props: { image: data.image!.base },
                });
              } catch {
                // do nothing
              }
            }}
          >
            Download wallpaper
          </a>
        </div>
      </div>
    </div>
  );
}

export default PhotoImage;

export const query = graphql`
  query PhotoImage($imageId: String) {
    image: file(id: { eq: $imageId }) {
      id
      publicURL
      base
      relativePath
      childImageSharp {
        fluid {
          aspectRatio
        }
        gatsbyImageData(placeholder: BLURRED)
      }
      fields {
        organization {
          slug
        }
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
        }
      }
    }
  }
`;