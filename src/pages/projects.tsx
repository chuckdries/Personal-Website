import * as React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { getImage, StaticImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import classnames from "classnames";

import {
  getHelmetSafeBodyStyle,
  getAspectRatio,
  getVibrantStyle,
} from "../utils";
import Nav from "../components/Nav";
import { use100vh } from "react-div-100vh";
import { useMediaQuery } from "../useMediaQuery";

const env =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

export type HomepageImage =
  Queries.ProjectsPageQuery["allFile"]["nodes"][number];

const ProjectsPage = ({
  data: {
    allFile: { nodes: images },
  },
}: PageProps<Queries.ProjectsPageQuery>) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    if (!isClient) {
      setIsClient(true);
    }
  }, [isClient]);

  const browserIsLandscape = useMediaQuery("(orientation: landscape)");

  const screenHeight = use100vh();

  // @ts-ignore
  return (
    <>
      {/* @ts-ignore */}
      <Helmet>
        <title>Projects | Chuck Dries</title>
        <body className="bg-white" />
      </Helmet>
      <main className="font-serif flex flex-col justify-start gap-4 items-center h-screen">
        <Nav />
        <p className="text-center max-w-[700px] bg-gray-200 rounded-full p-2 px-4 my-4">
          Take a look at my{" "}
          <a
            className="font-bold underline"
            rel="noreferrer"
            target="_blank"
            href="https://linkedin.com/in/chuckdries"
          >
            LinkedIn
          </a>{" "}
          for details on my professional experience
        </p>
        <div className="flex flex-col items-center lg:flex-row justify-center">
          <StaticImage
            alt="buzzwords screenshot"
            objectFit="contain"
            width={700}
            src="../images/buzzwords_screenshot.png"
          />
          <div className="flex flex-col justify-center p-2 lg:p-5">
            <div>
              <p className="italic opacity-60">Ongoing programming project</p>
              <h3 className="text-4xl font-bold">Buzzwords</h3>
              <p>Browser based word game</p>
            </div>
            <ul className="pl-4 list-disc mt-2 mb-4 w-full max-w-[400px]">
              <li>Seamless url-based multiplayer</li>
              <li>
                Beautiful UI with react, react-spring and react-three-fiber
              </li>
              <li>Backend with Mongo, Express, Typescript</li>
            </ul>
            <div className="flex gap-3 px-2">
              <a
                className="text-black bg-gray-500/10 hover:bg-gray-500/30 rounded-full p-2 px-4"
                href="https://github.com/ViciousFish/buzzwords"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              <a
                className="text-black bg-gray-500/10 hover:bg-gray-500/30 rounded-full p-2 px-4"
                href="https://chuckdries.itch.io/buzzwords"
                rel="noreferrer"
                target="_blank"
              >
                Itch.io
              </a>
              <a
                className="bg-buzzwordsPrimary hover:bg-buzzwordsPrimary/60 text-black rounded-full p-2 px-4"
                href="https://buzzwords.gg"
                rel="noreferrer"
                target="_blank"
              >
                Play now
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center lg:flex-row justify-center">
          <StaticImage
            alt="personal website screenshot"
            objectFit="contain"
            width={700}
            src="../images/personal-site-photos.png"
          />
          <div className="flex flex-col justify-center p-2 lg:p-5">
            <div>
              <p className="italic opacity-60">Ongoing programming project</p>
              <h3 className="text-4xl font-bold">Personal Website</h3>
              <p>A space to show off my photos</p>
            </div>
            <ul className="pl-4 list-disc mt-2 mb-4 w-full max-w-[400px]">
              <li>Showcase for my frontend skills and photography</li>
              <li>Fully custom virtualized masonry layout for /photos page</li>
              <li>Built with Gatsby, Tailwind CSS, and TypeScript</li>
            </ul>
            <div className="flex gap-3 px-2">
              <a
                className="text-black bg-gray-500/10 hover:bg-gray-500/30 rounded-full p-2 px-4"
                href="https://github.com/chuckdries/Personal-Website"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </main>
      <a className="hidden" href="https://hachyderm.io/@chuckletmilk" rel="me">
        Mastodon
      </a>
    </>
  );
};

export const query = graphql`
  query ProjectsPage {
    allFile(
      filter: {
        sourceInstanceName: { eq: "gallery" }
        base: { in: ["DSC05842.jpg", "DSC05900.jpg"] }
      }
      sort: { childImageSharp: { fluid: { aspectRatio: ASC } } }
    ) {
      nodes {
        base
      }
    }
  }
`;

export default ProjectsPage;
