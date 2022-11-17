import * as React from "react";
import { graphql, PageProps } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import { take } from "ramda";
import classnames from "classnames";

import { getHelmetSafeBodyStyle, getVibrant, getAspectRatio } from "../utils";
import Nav from "../components/Nav";
import ActionButtons from "../components/index/ActionButtons";
import { use100vh } from "react-div-100vh";
import { useMediaQuery } from "../useMediaQuery";

const env =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

export type HomepageImage = Queries.IndexPageQuery["allFile"]["nodes"][number];

const getDifferentRand = (
  range: number,
  lastNs: number[],
  iterations = 0
): number => {
  const n = Math.floor(Math.random() * range);
  if (lastNs.findIndex((x) => x === n) > -1 && iterations < 5) {
    console.log("got dupe, trying again", n);
    return getDifferentRand(range, lastNs, iterations + 1);
  }
  return n;
};

const IndexPage = ({
  data: {
    allFile: { nodes: images },
  },
}: PageProps<Queries.IndexPageQuery>) => {
  const [isClient, setIsClient] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);
  const image = React.useMemo(() => {
    return images[imageIndex];
  }, [images, imageIndex]);

  const shuffleImage = React.useCallback(
    (currentImage?: typeof images[number]) => {
      const lastThreeImages =
        JSON.parse(localStorage.getItem("lastHeros") ?? "[]") || [];
      if (env === "production") {
        try {
          window.plausible("Shuffle", {
            props: { currentImage: currentImage?.base },
          });
        } catch (e) {
          /* do nothing */
        }
      }
      const index = getDifferentRand(images.length, lastThreeImages);
      localStorage.setItem(
        "lastHeros",
        JSON.stringify(take(3, [index, ...lastThreeImages]))
      );
      setImageIndex(index);
    },
    [images.length]
  );

  // pick random image on page hydration
  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
      shuffleImage(image);
    }
  }, [isClient, imageIndex, image, shuffleImage]);

  // React.useEffect(() => {
  //   const keyListener = (e: KeyboardEvent) => {
  //     switch (e.code) {
  //       case "Space": {
  //         shuffleImage(image);
  //         return;
  //       }
  //       case "ArrowRight": {
  //         if (imageIndex === images.length - 1) {
  //           setImageIndex(0);
  //           return;
  //         }
  //         setImageIndex(imageIndex + 1);
  //         return;
  //       }

  //       case "ArrowLeft": {
  //         if (imageIndex === 0) {
  //           setImageIndex(images.length - 1);
  //           return;
  //         }
  //         setImageIndex(imageIndex - 1);
  //         return;
  //       }
  //     }
  //   };
  //   document.addEventListener("keydown", keyListener);
  //   return () => {
  //     document.removeEventListener("keydown", keyListener);
  //   };
  // }, [imageIndex, images.length, image, shuffleImage]);

  const browserIsLandscape = useMediaQuery("(orientation: landscape)");

  const vibrant = getVibrant(image);
  const ar = getAspectRatio(image);

  const screenHeight = use100vh();

  const imageIsLandscape = isClient ? ar > 1 : true;

  // @ts-ignore
  const img = getImage(image);
  return (
    <>
      {/* @ts-ignore */}
      <Helmet>
        <title>Chuck Dries</title>
        <body
          className={classnames(isClient ? "bg-muted-dark" : "bg-gray-800")}
          // @ts-ignore
          style={getHelmetSafeBodyStyle(vibrant!, screenHeight)}
        />
      </Helmet>
      <main
        className={classnames(
          "font-serif",
          imageIsLandscape
            ? "landscape:grid portrait:h-actual-screen portrait:flex flex-col justify-around"
            : "portrait:grid landscape:flex flex-row"
        )}
      >
        <div
          className={classnames(
            "landscape:flex-auto flex flex-col items-center",
            imageIsLandscape
              ? "portrait:items-center landscape:w-screen justify-between"
              : "landscape:justify-center portrait:w-screen"
          )}
          style={{ gridArea: "1/1" }}
        >
          <Nav
            internalLinks={[
              { href: "/", label: "Home" },
              { href: "/photogallery/", label: "Gallery" },
            ]}
          />
          <div
            className={classnames(
              "flex flex-col",
              !imageIsLandscape && "portrait:flex-auto "
            )}
          >
            <div
              className={classnames(
                "rounded-[50px] p-3 md:p-5 ml-2 mr-4 md:ml-3 md:mr-5 flex flex-col items-center z-10  mb-3",
                isClient
                  ? imageIsLandscape
                    ? "text-vibrant-light landscape:text-vibrant-dark landscape:cool-border-big landscape:border-r-[20px] landscape:border-b-[20px]"
                    : "text-vibrant-light portrait:text-vibrant-dark portrait:cool-border-big portrait:border-r-[20px] portrait:border-b-[20px]"
                  : "bg-gray-50 border-r-[20px] border-b-[20px]",
                isClient && ""
              )}
            >
              <h1
                className={classnames(
                  "mb-0 mt-0 text-center font-black z-20 text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
                )}
                style={{ lineHeight: "85%" }}
              >
                Chuck Dries
              </h1>
              <h2
                className={classnames(
                  "p-3 text-center z-20 font-bold text-lg md:text-2xl lg:text-3xl"
                )}
                style={{ lineHeight: "110%" }}
              >
                Full Stack Software Engineer &amp; Photographer
              </h2>
            </div>
          </div>
          <div
            className={classnames(
              imageIsLandscape ? "block portrait:hidden" : ""
            )}
          >
            <ActionButtons
              image={image}
              isClient={isClient}
              shuffleImage={shuffleImage}
            />
          </div>
        </div>
        {isClient && img ? (
          <GatsbyImage
            alt=""
            className={classnames(
              imageIsLandscape
                ? "landscape:h-actual-screen portrait:h-two-thirds-vw"
                : "h-actual-screen portrait:w-full"
            )}
            image={img}
            loading="eager"
            style={{
              gridArea: "1/1",
              width:
                browserIsLandscape && !imageIsLandscape
                  ? `${ar * 100}vh`
                  : "100%",
            }}
          />
        ) : (
          <div
            className="landscape:h-actual-screen portrait:h-two-thirds-vw w-full"
            style={{ gridArea: "1/1" }}
          ></div>
        )}
      </main>
    </>
  );
};

export const query = graphql`query IndexPage {
  allFile(
    filter: {sourceInstanceName: {eq: "gallery"}, base: {in: ["DSC02615-2.jpg"]}}
    sort: {fields: {imageMeta: {dateTaken: DESC}}}
  ) {
    nodes {
      relativePath
      base
      childImageSharp {
        fluid {
          aspectRatio
        }
        gatsbyImageData(
          layout: FULL_WIDTH
          placeholder: NONE
          breakpoints: [750, 1080, 1366, 1920, 2560, 3840]
        )
      }
      fields {
        imageMeta {
          vibrant {
            ...VibrantColors
          }
        }
      }
    }
  }
}`;

export default IndexPage;
