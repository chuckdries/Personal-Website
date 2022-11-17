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
          className="bg-white"
          // @ts-ignore
          style={getHelmetSafeBodyStyle({
            Muted: [0, 0, 0],
            LightMuted: [0, 0, 0],
            Vibrant: [0, 0, 0],
            LightVibrant: [0, 0, 0],
            DarkMuted: [255, 255, 255],
            DarkVibrant: [255, 255, 255],
          })}
        />
      </Helmet>
      <main className="font-sans">
        <Nav
          internalLinks={[
            { href: "/", label: "Home" },
            { href: "/photogallery/", label: "Gallery" },
          ]}
        />
        <GatsbyImage
          alt=""
          className="m-6 mt-0 max-h-[calc(100vh-77px)]"
          // className={classnames(
          //   imageIsLandscape
          //     ? "landscape:h-actual-screen portrait:h-two-thirds-vw"
          //     : "h-actual-screen portrait:w-full"
          // )}
          image={img!}
          loading="eager"
          style={
            {
              // gridArea: "1/1",
              // width:
              //   browserIsLandscape && !imageIsLandscape
              //     ? `${ar * 100}vh`
              //     : "100%",
            }
          }
        />
      </main>
    </>
  );
};

export const query = graphql`
  query IndexPage {
    allFile(
      filter: {
        sourceInstanceName: { eq: "gallery" }
        base: { in: ["DSC02615-2.jpg"] }
      }
      sort: { fields: { imageMeta: { dateTaken: DESC } } }
    ) {
      nodes {
        relativePath
        base
        childImageSharp {
          fluid {
            aspectRatio
          }
          gatsbyImageData(
            # layout: FULL_WIDTH
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
`;

export default IndexPage;
