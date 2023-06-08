import * as React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
// import { take } from "ramda";
import classnames from "classnames";

import { getHelmetSafeBodyStyle, getAspectRatio, getVibrantStyle } from "../utils";
import Nav from "../components/Nav";
// import ActionButtons from "../components/index/ActionButtons";
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

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  const browserIsLandscape = useMediaQuery("(orientation: landscape)");

  React.useLayoutEffect(() => {
    if (browserIsLandscape) {
      setImageIndex(1);
    } else {
      setImageIndex(0);
    }
  }, [browserIsLandscape]);

  // const vibrant = getVibrant(image);
  // const ar = getAspectRatio(image);

  const screenHeight = use100vh();

  // const imageIsLandscape = isClient ? ar > 1 : true;

  // @ts-ignore
  const img = getImage(image);
  return (
    <>
      {/* @ts-ignore */}
      <Helmet>
        <title>Chuck Dries</title>
        <body
          className="bg-white transition-colors"
          // @ts-ignore
          style={getHelmetSafeBodyStyle(getVibrantStyle({
            Muted: [0, 0, 0],
            LightMuted: [0, 0, 0],
            Vibrant: [0, 0, 0],
            LightVibrant: [238, 238, 238],
            DarkMuted: [238, 238, 238],
            DarkVibrant: [238, 238, 238],
          }))}
        />
      </Helmet>
      <main className="font-sans flex flex-col h-screen">
        <Nav
          internalLinks={[
            { href: "/", label: "Home" },
            { href: "/photogallery/", label: "Gallery" },
          ]}
        />
        {isClient && (
          <Link
            className="flex-auto flex flex-col  m-4 md:m-8 mt-0 md:mt-0"
            to={`/photogallery/${image.base}/`}
          >
            <GatsbyImage
              alt=""
              image={img!}
              loading="eager"
              objectFit={browserIsLandscape ? "cover" : "contain"}
              // objectFit="contain"
              style={{
                height: screenHeight
                  ? `${screenHeight - 268}px`
                  : "calc(100vh-268px)",
              }}
            />
          </Link>
        )}
      </main>
      <a className="hidden" rel="me" href="https://hachyderm.io/@chuckletmilk">Mastodon</a>
    </>
  );
};

export const query = graphql`
  query IndexPage {
    allFile(
      filter: {sourceInstanceName: {eq: "gallery"}, base: {in: ["DSC04357.jpg", "DSC03799.jpg"]}}
      sort: {childImageSharp: {fluid: {aspectRatio: ASC}}}
    ) {
      nodes {
        relativePath
        base
        childImageSharp {
          fluid {
            aspectRatio
          }
          gatsbyImageData(
            layout: CONSTRAINED
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
