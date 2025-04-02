import * as React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import { sortBy } from "ramda";

import Nav from "../components/Nav";
import "./index.css";
import { PostListingCarousel } from "../components/PostListing/PostListingCarousel";
import { useMemo } from "react";

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
  const today = new Date();
  const mostRecentPost = useMemo(() => allMdx.nodes.filter(node => {
    const postDate = new Date(node.frontmatter?.date ?? "");
    return postDate <= today;
  })[0], [allMdx.nodes]);


  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);


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
          content="Software Engineer and Photographer"
          name="description"
        />
      </Helmet>
      <main className="font-serif min-h-screen max-w-screen flex flex-col pb-2 lg:pb-4">
        <Nav />
        <div className="mt-2 prose w-full px-4 mx-auto">
          <h2 className="m-0">
            <Link className="font-bold" to="/projects">
              Programming projects &rarr;
            </Link>
          </h2>
        </div>
        <div className="flex flex-col xl:flex-row justify-center items-center xl:items-stretch gap-4">
          <div className="prose flex flex-col md:flex-row items-center gap-2 rounded-lg px-4">
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
                <p className="my-2">
                  Browser based word game I made with a friend. Features a beautiful 3D game board and a seamless url-based multiplayer experience.
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
                <p className="my-2">
                  This website! I'm particularly proud of the{" "}
                  <Link className="font-bold" to="/photos">
                    photo gallery
                  </Link>
                  {" "}page, which shows off my custom virtualized masonry component.
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
              to={`/posts${mostRecentPost.frontmatter?.slug}`}
            >
              {mostRecentPost.frontmatter?.title} &rarr;
            </Link>
          </h2>
        </div>
        <PostListingCarousel
          fullWidth={true}
          galleryImages={mostRecentPost.frontmatter?.galleryImages}
          playing
          shuffle={false}
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
            gatsbyImageData(height: 250, placeholder: DOMINANT_COLOR)
            fluid {
              aspectRatio
            }
          }
        }
      }
    }
    allMdx(sort: { frontmatter: { date: DESC } }, limit: 2) {
      nodes {
        frontmatter {
          slug
          date
          title
          galleryImages {
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
