import * as React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import { sortBy } from "ramda";
import classnames from "classnames";

import {
  getHelmetSafeBodyStyle,
  getAspectRatio,
  getVibrantStyle,
} from "../utils";
import Nav from "../components/Nav";
// import ActionButtons from "../components/index/ActionButtons";
import { use100vh } from "react-div-100vh";
import { useMediaQuery } from "../useMediaQuery";
import "./index.css";

const env =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

// export type HomepageImage = Queries.IndexPageQuery["allFile"]["nodes"][number];

const getDifferentRand = (
  range: number,
  lastNs: number[],
  iterations = 0,
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
    // allFile: { nodes: images },
    mdx,
  },
}: PageProps<Queries.IndexPageQuery>) => {
  const [isClient, setIsClient] = React.useState(false);
  // const [imageIndex, setImageIndex] = React.useState(0);
  // const image = React.useMemo(() => {
  //   return images[0];
  // }, [images]);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  // const browserIsLandscape = useMediaQuery("(orientation: landscape)");

  // React.useLayoutEffect(() => {
  //   if (browserIsLandscape) {
  //     setImageIndex(1);
  //   } else {
  //     setImageIndex(0);
  //   }
  // }, [browserIsLandscape]);

  // const vibrant = getVibrant(image);
  // const ar = getAspectRatio(image);

  const screenHeight = use100vh();

  // const imageIsLandscape = isClient ? ar > 1 : true;

  // @ts-ignore
  // const img = getImage(image);

  const images = React.useMemo(() => {
    if (!mdx?.frontmatter?.galleryImages) {
      return undefined;
    }
    if (!isClient) {
      return mdx.frontmatter.galleryImages;
    }
    return sortBy(() => Math.random() * 2 - 1, mdx.frontmatter.galleryImages);
  }, [isClient, mdx]);

  return (
    <>
      {/* @ts-ignore */}
      <Helmet>
        <title>Chuck Dries</title>
        <body className="bg-white" />
        <meta
          content="Full Stack Software Engineer and Photographer"
          name="description"
        />
      </Helmet>
      <main className="font-sans h-screen grid grid-rows-[min-content,minmax(0,1fr)]">
        <Nav />
        <div className="overflow-hidden relative" style={{ gridArea: `2 / 1` }}>
          {isClient && (
            <div className="animate-in fade-in duration-1000 prog-blur w-[calc(100%+300px)] left-[-150px] flex flex-wrap justify-center relative top-[-50px]">
              {images?.map(
                (imageData) =>
                  imageData?.childImageSharp?.gatsbyImageData && (
                    <GatsbyImage
                      alt={`An image called ${imageData?.base}`}
                      image={imageData!.childImageSharp!.gatsbyImageData!}
                      key={imageData?.base}
                    />
                  ),
              )}
            </div>
          )}
        </div>
        <div
          className="relative font-serif flex justify-center md:items-center p-4"
          style={{ gridArea: `2 / 1` }}
        >
          <div className="relative mt-6 md:-mt-8">
            <Link to={`/posts${mdx?.frontmatter!.slug}`}>
              <h1 className="text-center drop-shadow text-4xl font-bold text-slate-900 underline p-4 bg-white rounded-xl shadow-lg">
                {mdx?.frontmatter?.title}
              </h1>
            </Link>
            <span className="absolute -top-6 -left-3 z-10 inline-block text-left italic p-2 px-3 bg-green-200 rounded-full shadow-lg -rotate-6">
              new blog post
            </span>
          </div>
        </div>
        {/*
        {isClient && (
          <Link
            className="flex-auto flex flex-col m-4 md:m-8 mt-0 md:mt-0"
            to={image.fields!.organization!.slug!}
          >
            <GatsbyImage
              alt=""
              image={img!}
              loading="eager"
              objectFit={"cover"}
              // objectFit="contain"
              style={{
                height: screenHeight
                  ? `${screenHeight - 268}px`
                  : "calc(100vh-268px)",
              }}
            />
          </Link>
        )} */}
      </main>
      <a className="hidden" href="https://hachyderm.io/@chuckletmilk" rel="me">
        Mastodon
      </a>
    </>
  );
};

export const query = graphql`
  query IndexPage {
    mdx(frontmatter: { slug: { eq: "/2024-year-in-review" } }) {
      frontmatter {
        slug
        title
        galleryImages {
          base
          childImageSharp {
            gatsbyImageData(height: 170, placeholder: DOMINANT_COLOR)
          }
        }
      }
    }
    # allFile(
    #   #                                                           landscape      portrait
    #   filter: {
    #     sourceInstanceName: { eq: "photos" }
    #     base: { in: ["DSC08277-Edit-positive.jpg"] }
    #   }
    #   sort: { childImageSharp: { fluid: { aspectRatio: ASC } } }
    # ) {
    #   nodes {
    #     relativePath
    #     base
    #     childImageSharp {
    #       fluid {
    #         aspectRatio
    #       }
    #       gatsbyImageData(
    #         layout: CONSTRAINED
    #         placeholder: DOMINANT_COLOR
    #         breakpoints: [750, 1080, 1366, 1920, 2560, 3840]
    #       )
    #     }
    #     fields {
    #       organization {
    #         slug
    #       }
    #     }
    #     # fields {
    #     #   imageMeta {
    #     #     vibrant {
    #     #       ...VibrantColors
    #     #     }
    #     #   }
    #     # }
    #   }
    # }
  }
`;

export default IndexPage;
