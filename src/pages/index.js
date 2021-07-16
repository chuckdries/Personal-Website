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

const IndexPage = ({
  data: {
    allFile: { edges },
  },
}) => {
  const [isClient, setIsClient] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);
  const images = React.useMemo(() => edges.map((edge) => edge.node), [edges]);
  const image = React.useMemo(() => {
    console.log("ii", imageIndex);
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
  }, [imageIndex, images.length]);

  const vibrant = getVibrant(image);
  const ar = getAspectRatio(image);
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
        {/* <div className={classnames('relative grid', ar <= 1 ? 'place-items-end landscape:place-items-center' : 'place-items-end')} style={{gridArea: '1/1'}}> */}
        <div
          className={classnames(
            "flex flex-col items-center justify-between",
            ar > 1 || !isClient
              ? "portrait:items-center"
              : "landscape:justify-center"
          )}
          style={{ gridArea: "1/1" }}
        >
          {/* CQ change based on sampling of picture? add background? */}
          <nav
            className={classnames(
              "text-vibrant-dark px-6 p-4",
              ar > 1 || !isClient ? "landscape:w-screen" : "portrait:w-screen"
            )}
            style={{ zIndex: 100 }}
          >
            <ul className="flex justify-between">
              <li>gallery</li>
              <li>resume</li> <li>github</li> <li>devpost</li> <li>contact</li>
            </ul>
          </nav>
          {/* <div className="flex mx-6 justify-end">
            <div className="flex my-2 items-center flex-col">
              <Link
                className={classnames(
                  'hover:underline inline-block px-1 my-1 mr-2 text-md rounded-md border-2',
                  isClient && 'text-muted-dark bg-muted-light blurred-or-opaque-bg-2 hover:bg-muted border-muted-dark')} 
                id="image-link"
                title="view image details"
                to={`/photogallery/${image.base}/`}
              >
                Photography Gallery
              </Link>
              <button
                className={classnames(
                  'hover:underline inline-block px-1 my-1 mr-2 text-md rounded-md border-2',
                  isClient && 'text-muted-dark bg-muted-light hover:bg-muted border-muted-dark')}
                id="shuffle-button"
                onClick={() => {
                  shuffleImage(image);
                }}
                title="shuffle image"
                type="button"
              >
                <span className="icon-offset"><ion-icon name="shuffle"></ion-icon></span>
              </button>
            </div>
            <section
              className={classnames(
                'hover:underline p-3 px-5 py-4 my-3 text-md sm:text-lg rounded-md border-2 arrow-right-after font-bold font-serif',
                isClient && 'text-muted-dark bg-muted-light bg-opacity-70 border-muted-dark hover:bg-muted')} 
              id="photogallery-link"
              to="/photogallery/"
            >
            Photography Gallery
            </Link>
          </div> */}
          <div className="flex flex-col items-center">
            <h1
              className={classnames(
                "font-black filter drop-shadow-dark z-20",
                isClient && "mb-5 mt-0 text-vibrant-light"
              )}
              style={{ fontSize: "max(8vw, 100px)", lineHeight: "80%" }}
            >
              Chuck Dries
            </h1>
            <div
              className={classnames(
                ar > 1 && "landscape:shadow-lg",
                "mb-4 inline-block",
                isClient && "bg-vibrant-dark blurred-or-opaque-bg-1"
              )}
            >
              <div
                // className="mx-auto filter drop-shadow"
                className={classnames(
                  "mx-auto filter drop-shadow items-end",
                  ar > 1 || !isClient ? "" : ""
                )}
              >
                <div className="flex-auto">
                  <h2
                    className={classnames(
                      "p-3",
                      isClient && "text-vibrant-light"
                    )}
                    style={{ fontSize: "max(1vw, 20px)" }}
                  >
                    Full Stack Software Engineer &amp; Hobbyist Photographer
                  </h2>
                </div>
                {/* {<div className="border-t-2 border-muted-light mt-2 mr-2 mb-1" style={{width: 30}}></div>} */}

                {/* <ul className={' md:mr-4', classnames(isClient && 'text-muted-light')}>
                <li>Software Engineer, Axosoft</li>
                <li><HeroA className="ml-0" href="mailto:chuck@chuckdries.com" isClient={isClient}>chuck@chuckdries.com</HeroA>/<span className="ml-2">602.618.0414</span></li>
                <li>
                  <HeroA className="ml-0" href="http://github.com/chuckdries" isClient={isClient}>Github</HeroA>/
                  <HeroA href="https://www.linkedin.com/in/chuckdries/" isClient={isClient}>LinkedIn</HeroA>/
                  <HeroA href="https://devpost.com/chuckdries" isClient={isClient}>Devpost</HeroA>/
                  <HeroA href="/CharlesDriesResumeCurrent.pdf" isClient={isClient}>Resume [pdf]</HeroA>/
                  <HeroA href="https://medium.com/@chuckdries" isClient={isClient}>Medium (blog)</HeroA>
                </li>
              </ul> */}
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </main>
    </>
  );
};

export const query = graphql`
  {
    allFile(
      filter: { sourceInstanceName: { eq: "gallery" } }
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
