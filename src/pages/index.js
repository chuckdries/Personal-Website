import * as React from "react";
import { Link, graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import { take } from "ramda";
import classnames from "classnames";
import posthog from "posthog-js";

import {
  getVibrantToHelmetSafeBodyStyle,
  getVibrant,
  getAspectRatio,
} from "../utils";
import { HeroA } from "../components/Index/HeroLink";

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

const ImageButtons = ({ isClient, image, shuffleImage }) => (
  <div className="flex mx-6 mb-6">
    <Link
      className={classnames(
        "z-20 rounded-md text-md inline-block px-3 py-2 my-1 mr-2 text-md",
        isClient &&
          "text-muted-light bg-muted-dark hover:bg-muted blurred-or-opaque-bg-2"
      )}
      id="image-link"
      title="view image details"
      to={`/photogallery/${image.base}/`}
    >
      <span className="icon-offset">
        <ion-icon name="image"></ion-icon>
      </span>
    </Link>
    <button
      className={classnames(
        "z-20 rounded-md text-md inline-block px-3 py-2 my-1 mr-2 text-md",
        isClient &&
          "text-muted-light bg-muted-dark hover:bg-muted blurred-or-opaque-bg-2"
      )}
      id="shuffle-button"
      onClick={() => {
        shuffleImage(image);
      }}
      title="shuffle image"
      type="button"
    >
      <span className="icon-offset">
        <ion-icon name="shuffle"></ion-icon>
      </span>
    </button>
    <Link
      className={classnames(
        "self-center z-20 hover:underline rounded-md px-4 py-2 text-md font-bold font-serif",
        isClient &&
          "text-muted-light bg-muted-dark hover:bg-muted blurred-or-opaque-bg-2"
      )}
      id="photogallery-link"
      to="/photogallery/"
    >
      Photography Gallery
    </Link>
  </div>
);

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
          // eslint-disable-next-line
          posthog.capture("[shuffle image]", {
            currentImage: currentImage?.base,
          });
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
      {/* WIP: ipad portrait hits md breakpoint, looks bad */}
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
          // 67vw = 1/1.49253731 = 1/aspect ratio of my camera lol
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
          <nav
            className={classnames(
              isClient &&
                "text-vibrant-dark bg-vibrant-dark blurred-or-opaque-bg-2",
              "px-6 p-2",
              ar > 1 || !isClient ? "landscape:w-screen" : "portrait:w-screen"
            )}
            style={{ zIndex: 100 }}
          >
            <ul className="flex flex-wrap justify-center">
              <li>
                <HeroA
                  href="/CharlesDriesResumeCurrent.pdf"
                  isClient={isClient}
                >
                  Resume
                </HeroA>
              </li>
              <li>
                {" "}
                <HeroA href="https://github.com/chuckdries" isClient={isClient}>
                  Github
                </HeroA>
              </li>
              <li>
                <HeroA
                  href="https://www.linkedin.com/in/chuckdries/"
                  isClient={isClient}
                >
                  LinkedIn
                </HeroA>
              </li>
              <li>
                <HeroA
                  href="https://devpost.com/chuckdries"
                  isClient={isClient}
                >
                  Devpost
                </HeroA>
              </li>
              <li>
                <HeroA
                  href="https://medium.com/@chuckdries"
                  isClient={isClient}
                >
                  Medium (blog)
                </HeroA>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col items-center">
            <h1
              className={classnames(
                "mb-5 mt-0 text-huge-1 md:text-huge-2 text-center font-black filter drop-shadow-dark z-20",
                isClient &&
                  (ar > 1
                    ? "text-vibrant-light landscape:text-gray-50 landscape:opacity-80"
                    : "text-gray-50 opacity-80 landscape:text-vibrant-light")
              )}
              style={{ lineHeight: "85%" }}
            >
              Chuck Dries
            </h1>
            <div
              className={classnames(
                ar > 1 && "landscape:shadow-lg",
                "z-20 mb-4 inline-block mx-2",
                isClient && "bg-vibrant-dark blurred-or-opaque-bg-1"
              )}
            >
              <div className="flex-auto">
                <h2
                  className={classnames(
                    "p-3 text-center",
                    isClient && "text-vibrant-light"
                  )}
                  style={{ fontSize: "max(1vw, 20px)" }}
                >
                  Full Stack Software Engineer &amp; Hobbyist Photographer
                </h2>
              </div>
            </div>
          </div>
          <ImageButtons
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
            "20160530-DSC09108.jpg"
            "20180424-DSC07948.jpg"
            "20200215-DSC02694.jpg"
            "DSC00201.jpg"
            "DSC01699.jpg"
            "DSC04905.jpg"
            "DSC05761.jpg"
            "DSC05851.jpg"
            "DSC06245.jpg"
            "DSC08511.jpg"
            "DSC08521.jpg"
            "DSC07490.jpg"
            "DSC02538.jpg"
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
