import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import { take } from "ramda";
import classnames from "classnames";

import {
  getVibrantToHelmetSafeBodyStyle,
  getVibrant,
  getAspectRatio,
} from "../utils";
import Nav from "../components/index/Nav";
import ActionButtons from "../components/index/ActionButtons";

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
  console.log("bg", image.base);

  return (
    <>
      <Helmet>
        <title>Chuck Dries</title>
        <body
          className={classnames(isClient ? "bg-vibrant-dark" : "")}
          style={getVibrantToHelmetSafeBodyStyle(vibrant)}
        />
      </Helmet>
      <main
        className={classnames(
          "font-serif hero",
          ar > 1 || !isClient
            ? "landscape:grid portrait:flex portrait:flex-col"
            : "portrait:grid landscape:flex landscape:flex-row-reverse"
        )}
      >
        {isClient ? (
          <GatsbyImage
            alt=""
            className={classnames(
              ar > 1 || !isClient
                ? "landscape:h-screen portrait:h-two-thirds-vw"
                : "h-screen portrait:w-full landscape:w-1/2"
            )}
            image={getImage(image)}
            loading="eager"
            style={{
              gridArea: "1/1",
            }}
          />
        ) : (
          <div
            className="landscape:h-screen portrait:h-two-thirds-vw w-full"
            style={{ gridArea: "1/1" }}
          ></div>
        )}
        <div
          className={classnames(
            "flex flex-auto flex-col items-center justify-between",
            ar > 1 || !isClient
              ? "portrait:items-center"
              : "landscape:justify-center"
          )}
          style={{ gridArea: "1/1" }}
        >
          <Nav ar={ar} isClient={isClient} />
          <div className="flex flex-col items-center">
            <h1
              className={classnames(
                "mb-0 mt-0 text-huge-1 md:text-huge-2 text-center font-black filter drop-shadow-dark z-20",
                isClient &&
                  (ar > 1
                    ? "text-vibrant-light landscape:text-gray-50 landscape:opacity-80"
                    : "text-gray-50 opacity-80 landscape:text-vibrant-light")
              )}
              style={{ lineHeight: "85%" }}
            >
              Chuck Dries
            </h1>
            <h2
              className={classnames(
                "p-3 text-center z-20 filter drop-shadow-dark font-bold",
                isClient &&
                  (ar > 1
                    ? "text-vibrant-light landscape:text-gray-100"
                    : "text-gray-100 landscape:text-vibrant-light")
              )}
              style={{ fontSize: "max(1.3vw, 25px)", lineHeight: '110%' }}
            >
              Full Stack Software Engineer &amp; Hobbyist Photographer
            </h2>
          </div>
          <ActionButtons
            image={image}
            isClient={isClient}
            shuffleImage={shuffleImage}
          />
        </div>
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
            "DSC00201.jpg" # duck
            "DSC04905.jpg" # purple layers
            "DSC05761.jpg" # monument valley
            "DSC05851.jpg" # utahn highway sunset
            "DSC06245.jpg" # snowy milky way
            "DSC08521.jpg" # firepit bloom j&e
            "DSC07490.jpg" # house on prairie
            "DSC02538.jpg" # portrait pink cactus bloom
            "20190624-DSC00771.jpg" # glacier forest fog
            "DSC00237.jpg" # cotton candy clouds
            "_DSC6062.jpg" # field of wildflowers
            "_DSC6060.jpg" # edge of the world
            "_DSC6219.jpg" # whihte/yellow rosebush
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
