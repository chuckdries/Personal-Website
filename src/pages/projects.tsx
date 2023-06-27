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
        <body
          className="bg-white transition-colors"
          // @ts-ignore
          style={getHelmetSafeBodyStyle(
            // @ts-ignore
            getVibrantStyle({
              Muted: [0, 0, 0],
              LightMuted: [0, 0, 0],
              Vibrant: [0, 0, 0],
              LightVibrant: [238, 238, 238],
              DarkMuted: [238, 238, 238],
              DarkVibrant: [238, 238, 238],
            })
          )}
        />
      </Helmet>
      <main className="font-sans flex flex-col h-screen">
        <div className="bg-buzzwordsLightBg h-[100vh] pb-8 flex flex-col">
          <Nav
            internalLinks={[
              { href: "/", label: "Home" },
              { href: "/projects", label: "Projects" },
              { href: "/photogallery/", label: "Gallery" },
            ]}
          />
          <div className="flex lg:flex-auto flex-col items-center lg:flex-row justify-center">
            <StaticImage
              alt="buzzwords screenshot"
              className="lg:max-w-[calc(1.53*50vh)] lg:w-[50vw]"
              // layout="constrained"
              objectFit="contain"
              src="../images/buzzwords_screenshot.png"
              style={{
                float: "left",
              }}
            />
            <div className="flex flex-col gap-4 justify-center p-2 lg:p-4">
              <h3 className="text-4xl font-bold">Buzzwords</h3>
              <ul className="pl-4 list-disc">
                <li>Browser based word game with seamless link sharing multiplayer</li>
                <li>UI with react, react-spring and react-three-fiber</li>
                <li>Backend with Mongo, Express, Typescript</li>
              </ul>
              <div className="flex gap-3 px-2">
                <a
                  className="text-black bg-gray-500/10 hover:bg-gray-500/40 rounded-full p-2 px-4"
                  href="https://github.com/ViciousFish/buzzwords"
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
                <a
                  className="text-black bg-gray-500/10 hover:bg-gray-500/40 rounded-full p-2 px-4"
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
