import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import { take } from "ramda";
import classnames from "classnames";

import {
  getHelmetSafeBodyStyle,
  getVibrant,
  getAspectRatio,
} from "../utils";
import Nav from "../components/index/Nav";
import ActionButtons from "../components/index/ActionButtons";
import { use100vh } from "react-div-100vh";

const env =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

const getDifferentRand = (range, lastNs, iterations = 0) => {
  const n = Math.floor(Math.random() * range);
  if (lastNs.findIndex((x) => x === n) > -1 && iterations < 5) {
    console.log("got dupe, trying again", n);
    return getDifferentRand(range, lastNs, iterations + 1);
  }
  return n;
};

const IndexPage = ({
  data: {
    allFile: { edges },
  },
}) => {
  const [isClient, setIsClient] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);
  const images = React.useMemo(() => edges.map((edge) => edge.node), [edges]);
  const image = React.useMemo(() => {
    return images[imageIndex];
  }, [images, imageIndex]);

  const shuffleImage = React.useCallback(
    (currentImage) => {
      const lastThreeImages =
        JSON.parse(localStorage.getItem("lastHeros")) || [];
      if (env === "production") {
        try {
          window.plausible("Shuffle", {
            props: { currentImage: currentImage?.base },
          });
          // eslint-disable-next-line
          _paq.push(["trackEvent", "Index", "Shuffle", currentImage?.base]);
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

  React.useEffect(() => {
    const keyListener = (e) => {
      switch (e.code) {
        case "Space": {
          shuffleImage(image);
          return;
        }
        case "ArrowRight": {
          if (imageIndex === images.length - 1) {
            setImageIndex(0);
            return;
          }
          setImageIndex(imageIndex + 1);
          return;
        }

        case "ArrowLeft": {
          if (imageIndex === 0) {
            setImageIndex(images.length - 1);
            return;
          }
          setImageIndex(imageIndex - 1);
          return;
        }
      }
    };
    document.addEventListener("keydown", keyListener);
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  }, [imageIndex, images.length, image, shuffleImage]);

  const vibrant = getVibrant(image);
  const ar = getAspectRatio(image);

  const screenHeight = use100vh();

  const imageIsLandscape = isClient ? ar > 1 : true;

  return (
    <>
      <Helmet>
        <title>Chuck Dries</title>
        <body
          className={classnames(isClient ? "bg-vibrant-dark" : "bg-gray-800")}
          style={getHelmetSafeBodyStyle(vibrant, screenHeight)}
        />
      </Helmet>
      <main
        className={classnames(
          "font-serif",
          imageIsLandscape
            ? "landscape:grid portrait:h-actual-screen portrait:flex flex-col justify-evenly"
            : "portrait:grid landscape:flex flex-row"
        )}
      >
        <div
          className={classnames(
            "landscape:flex-auto flex flex-col items-center justify-between",
            imageIsLandscape
              ? "portrait:items-center"
              : "landscape:justify-center"
          )}
          style={{ gridArea: "1/1" }}
        >
          <Nav ar={ar} isClient={isClient} />
          <div className="flex flex-col items-center">
            <h1
              className={classnames(
                "mb-0 mt-0 text-center font-black z-20 text-7xl md:text-8xl lg:text-9xl",
                isClient ? "filter drop-shadow-dark" : "text-white",
                isClient &&
                  (imageIsLandscape
                    ? "text-vibrant-light landscape:text-gray-50 landscape:opacity-80"
                    : "text-gray-50 opacity-80 landscape:text-vibrant-light")
              )}
              style={{ lineHeight: "85%" }}
            >
              Chuck Dries
            </h1>
            <h2
              className={classnames(
                "p-3 text-center z-20 font-bold text-xl lg:text-2xl",
                isClient ? "filter drop-shadow-dark" : "text-white",
                isClient &&
                  (imageIsLandscape
                    ? "text-vibrant-light landscape:text-gray-100"
                    : "text-gray-100 landscape:text-vibrant-light")
              )}
              style={{ lineHeight: "110%" }}
            >
              Full Stack Software Engineer &amp; Hobbyist Photographer
            </h2>
          </div>

          <div
            className={classnames(
              imageIsLandscape ? "block portrait:hidden" : "block"
            )}
          >
            <ActionButtons
              image={image}
              isClient={isClient}
              shuffleImage={shuffleImage}
            />
          </div>
          {/* <div className={isLandscape ? 'hidden portrait:block' : 'hidden'}></div> */}
        </div>
        {isClient ? (
          <GatsbyImage
            alt=""
            className={classnames(
              imageIsLandscape
                ? "landscape:h-actual-screen portrait:h-two-thirds-vw"
                : "h-actual-screen portrait:w-full landscape:w-1/2"
            )}
            image={getImage(image)}
            loading="eager"
            style={{
              gridArea: "1/1",
            }}
          />
        ) : (
          <div
            className="landscape:h-actual-screen portrait:h-two-thirds-vw w-full"
            style={{ gridArea: "1/1" }}
          ></div>
        )}
        {imageIsLandscape && (
          <div className="hidden portrait:flex justify-center my-2">
            <ActionButtons
              image={image}
              isClient={isClient}
              shuffleImage={shuffleImage}
            />
          </div>
        )}
      </main>
    </>
  );
};

export const query = graphql`
  {
    allFile(
      filter: {
        sourceInstanceName: { eq: "gallery" }
        base: {
          in: [
            "20160530-DSC09108.jpg" # portrait red flowers
            # "DSC00201.jpg" # duck
            "DSC04905.jpg" # purple layers
            "DSC05761.jpg" # monument valley
            "DSC05851.jpg" # utahn highway sunset
            "DSC06245.jpg" # snowy milky way
            # "DSC08521.jpg" # firepit bloom j&e
            # "DSC07490.jpg" # house on prairie
            "DSC02538.jpg" # portrait pink cactus bloom
            "20190624-DSC00771.jpg" # glacier forest fog
            # "DSC00237.jpg" # cotton candy clouds
            "_DSC6062.jpg" # field of wildflowers
            "_DSC6060.jpg" # edge of the world
            "_DSC6219.jpg" # whihte/yellow rosebush
            "_DSC6243.jpg" # bright rose in darkness
            "_DSC6400-2.jpg" # Horsetail falls
            "_DSC6798.jpg" # Japanese zen garden
            "_DSC6481.jpg" # Mt Hood from Powell Butte
            "_DSC5916.jpg" # blue dart stinger
            "_DSC0286.jpg" # god rays
            "_DSC8998.jpg" # forest road
          ]
        }
      }
      sort: { order: DESC, fields: fields___imageMeta___dateTaken }
    ) {
      edges {
        node {
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
    }
  }
`;

export default IndexPage;
