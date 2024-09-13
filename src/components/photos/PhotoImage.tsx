import { Link, PageProps, graphql, navigate } from "gatsby";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { PhotoLayout } from "./PhotoLayout";
import { GatsbyImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import Nav from "../Nav";
import {
  getHelmetSafeBodyStyle,
  getMeta,
  getShutterFractionFromExposureTime,
  getVibrantStyle,
} from "../../utils";
import MetadataItem from "./MetadataItem";

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
import { OverlayNavArrow } from "./PhotoImage/OverlayNavArrow";
import { NavArrowOverlay } from "./PhotoImage/NavArrowOverlay";

const IconStyle = {
  width: "24px",
  margin: "0 4px",
};

interface SiblingLocationState {
  siblingNodesLeft: string[];
  siblingNodesRight: string[];
}

function isSiblingState(state: unknown): state is SiblingLocationState {
  return (
    typeof state === "object" &&
    state !== null &&
    "siblingNodesLeft" in state &&
    "siblingNodesRight" in state
  );
}

export interface SiblingNavData {
  next: string;
  state: SiblingLocationState;
}

function getLeftNavData(
  { siblingNodesLeft, siblingNodesRight }: SiblingLocationState,
  current: string,
): SiblingNavData | null {
  if (!siblingNodesLeft.length) {
    return null;
  }
  const [next, ...rest] = siblingNodesLeft;
  return {
    next: `/${next}`,
    state: {
      siblingNodesLeft: rest,
      siblingNodesRight: [current, ...siblingNodesRight],
    },
  };
}

function getRightNavData(
  { siblingNodesLeft, siblingNodesRight }: SiblingLocationState,
  current: string,
): SiblingNavData | null {
  if (!siblingNodesRight.length) {
    return null;
  }
  const [next, ...rest] = siblingNodesRight;
  return {
    next: `/${next}`,
    state: {
      siblingNodesLeft: [current, ...siblingNodesLeft],
      siblingNodesRight: rest,
    },
  };
}

export interface SiblingNavDatas {
  left: SiblingNavData | null;
  right: SiblingNavData | null;
}

function getSiblingDatas(
  _state: SiblingLocationState,
  current: string,
): SiblingNavDatas {
  return {
    left: getLeftNavData(_state, current),
    right: getRightNavData(_state, current),
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
    replace: true,
  });
}

const FilmstockKeywords = [
  "Cinestill 50D",
  "Ektar 100",
  "Kodak Gold 200",
  "Ektachrome E100",
  "Instax Square",
  "Portra 400",
];

function PhotoImage({
  pageContext,
  data,
  location,
}: PageProps<Queries.PhotoImageQuery, { imageId: string }>) {
  const siblingNavDatas = isSiblingState(location.state)
    ? getSiblingDatas(location.state, data.image!.fields!.organization!.slug!)
    : null;

  const imageRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    setTimeout(() => {
      const imgHeight = (imageRef.current?.clientHeight ?? 0) 
      if (imgHeight > (window.innerHeight - 220)) {
        window.scrollTo({
          top: (imageRef.current?.offsetTop ?? 0) - (window.innerHeight - imgHeight) / 2,
          behavior: "smooth",
        });
      }
    }, 60);
  }, [data.image?.base]);

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(-1);
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
          className="bg-neutral-900 text-white"
          // @ts-expect-error not a style prop
          style={getHelmetSafeBodyStyle({
            // @ts-expect-error not a style prop
            "--dark-vibrant": `25, 25, 25`,
          })}
        />
      </Helmet>
      <Nav className="mb-0" scheme="dark" />
      {/* <div className="flex-auto "> */}
      <div className="relative" ref={imageRef}>
        <GatsbyImage
          alt="photo"
          className="max-h-[99vh]"
          id="photo"
          image={data.image!.childImageSharp!.gatsbyImageData}
          objectFit="contain"
        />
        {siblingNavDatas && (
          <NavArrowOverlay siblingNavDatas={siblingNavDatas} />
        )}
      </div>
      <div className="flex justify-center p-6">
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
                    <div className="sm:flex justify-end gap-2 bg-gray-500/20 py-3 pl-4 rounded">
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
        <div className="justify-self-stretch border border-white border-opacity-10" />
        <div className="px-4">
          <p className="font-mono text-sm mb-4">{image.base}</p>
          <a
            className="cursor-pointer font-sans px-3 py-2 rounded text-white border border-blue-500/50 bg-blue-500/30 hover:bg-blue-500/70 hover:border-blue-500/80 transition-colors"
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
