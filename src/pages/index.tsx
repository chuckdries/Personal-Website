import * as React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
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
import { useDateFormatter } from "react-aria";
import { PostListing } from "../components/PostListing/PostListing";
import { PostListingCarousel } from "../components/PostListing/PostListingCarousel";

const env =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

export type HomepageImage = Queries.IndexPageQuery["allFile"]["nodes"][number];

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
    file,
    allFile,
    allMdx,
  },
}: PageProps<Queries.IndexPageQuery>) => {
  const [isClient, setIsClient] = React.useState(false);
  // const [imageIndex, setImageIndex] = React.useState(0);
  // const image = React.useMemo(() => {
  //   return images[0];
  // }, [images]);

  const df = useDateFormatter({
    timeZone: "utc",
  });
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
      <Helmet>
        <title>Chuck Dries</title>
        <body className="bg-white" />
        <meta
          content="Full Stack Software Engineer and Photographer"
          name="description"
        />
      </Helmet>
      <main className="font-serif min-h-screen max-w-screen flex flex-col pb-2 lg:pb-4">
        <Nav />
        <div className="mt-2 prose w-full p-4 mx-auto">
          <h2 className="m-0">
            <Link className="font-bold" to="/projects">
              Programming projects &rarr;
            </Link>
          </h2>
        </div>
        <div className="flex flex-col xl:flex-row justify-center items-center xl:items-stretch gap-4">
          <div className="prose flex flex-col md:flex-row items-center gap-2 rounded-lg p-4">
            <StaticImage
              src="../images/buzzwords_screenshot.png"
              alt="Buzzwords"
              className="rounded-lg flex-shrink-0"
              width={300}
              objectFit="contain"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="m-0">Buzzwords</h3>
                <p className="mb-0">
                  Browser based word game with seamless url-based multiplayer.
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  className="bg-buzzwordsPrimary text-black rounded-full px-3 py-1"
                  href="https://buzzwords.gg"
                  rel="noreferrer"
                  target="_blank"
                >
                  Play now
                </a>
                <a
                  className="bg-gray-500/10 text-black rounded-full px-3 py-1"
                  href="https://github.com/ViciousFish/buzzwords"
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="prose hidden lg:flex flex-col md:flex-row items-center gap-2 rounded-lg p-4">
            <StaticImage
              src="../images/personal-site-photos.png"
              alt="Personal website"
              className="rounded-lg flex-shrink-0"
              width={300}
              objectFit="contain"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="m-0">Personal website</h3>
                <p className="mb-2">
                  This website! A space to show off my photos. Click around to
                  see more. I'm particularly proud of the{" "}
                  <Link className="font-bold" to="/photos">
                    photo gallery
                  </Link>
                  .
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  className="bg-gray-500/10 text-black rounded-full px-3 py-1"
                  href="https://github.com/chuckdries/Personal-Website"
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="prose w-full p-4 mx-auto">
          <span className="text-sm text-gray-500 italic">
            featured blog post
          </span>
          <h2 className="mt-0">
            <Link className="font-bold" to={`/posts${mdx?.frontmatter?.slug}`}>
              {mdx?.frontmatter?.title} &rarr;
            </Link>
          </h2>
        </div>
        <PostListingCarousel
          fullWidth={true}
          galleryImages={mdx?.frontmatter?.galleryImages}
          playing
        />

        <div className="mt-2 lg:mt-4 xl:mt-6 prose w-full p-4 mx-auto">
          <span className="text-sm text-gray-500 italic">latest photos</span>
          <h2 className="mt-0">
            <Link className="font-bold" to="/photos">
              New photos from{" "}
              {file?.fields?.organization?.monthSlug?.split("/")[1]}{" "}
              {file?.fields?.organization?.year} &rarr;
            </Link>
          </h2>
        </div>
        <PostListingCarousel
          fullWidth={true}
          galleryImages={allFile.nodes}
          playing
        />
        <div className="mt-2 lg:mt-4 xl:mt-6 prose w-full p-4 mx-auto">
          <span className="text-sm text-gray-500 italic">latest blog post</span>
          <h2 className="mt-0">
            <Link
              className="font-bold"
              to={`/posts${allMdx.nodes[0].frontmatter?.slug}`}
            >
              {allMdx.nodes[0].frontmatter?.title} &rarr;
            </Link>
          </h2>
        </div>
        <PostListingCarousel
          fullWidth={true}
          galleryImages={allMdx.nodes[0].frontmatter?.galleryImages}
          playing
        />
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
            fluid {
              aspectRatio
            }
          }
        }
      }
    }
    allMdx(sort: { frontmatter: { date: DESC } }, limit: 1) {
      nodes {
        frontmatter {
          slug
          title
          galleryImages {
            base
            childImageSharp {
              gatsbyImageData(height: 400, placeholder: DOMINANT_COLOR)
              fluid {
                aspectRatio
              }
            }
          }
        }
      }
    }
    file(fields: { organization: { month: { eq: 3 }, year: { eq: 2025 } } }) {
      fields {
        organization {
          month
          monthSlug
          yearFolder
          slug
          year
        }
      }
    }
    allFile(
      filter: {
        fields: { organization: { month: { eq: 3 }, year: { eq: 2025 } } }
      }
    ) {
      nodes {
        base
        childImageSharp {
          gatsbyImageData(height: 250, placeholder: DOMINANT_COLOR)
          fluid {
            aspectRatio
          }
        }
      }
    }
  }
`;

export default IndexPage;
