import { Link, PageProps, graphql, navigate } from "gatsby";
import React, { useEffect } from "react";
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
import MetadataItem from "../GalleryImage/MetadataItem";

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

const IconStyle = {
  width: "24px",
  margin: "0 4px",
};

function PhotoImage({
  pageContext,
  data,
}: PageProps<Queries.PhotoImageQuery, { imageId: string }>) {
  console.log("🚀 ~ data:", data);
  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(-1);
      }
    };
    document.addEventListener("keydown", keyListener);
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  }, []);

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

  const film = React.useMemo(() => meta?.Keywords?.includes("Film"), [meta]);
  return (
    <div className="min-h-screen">
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
      <GatsbyImage
        alt="photo"
        objectFit="contain"
        image={data.image!.childImageSharp!.gatsbyImageData}
        // className="h-full w-full object-contain"
        className="max-h-[90vh]"
      />
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
                data={"-"}
                icon={<Filmroll UNSAFE_style={IconStyle} />}
                title={"filmstock"}
              />
            )}
            {!film && (
              <>
                {meta && (
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
