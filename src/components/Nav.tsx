import React, { useRef, useState } from "react";
import classnames from "classnames";
import { Link, navigate } from "gatsby";
import { Popover } from "react-tiny-popover";
import { StaticImage } from "gatsby-plugin-image";

const navClasses = (scheme: "light" | "dark") =>
  classnames(
    "hover:underline hover:bg-black/10 block p-3 flex-shrink-0 whitespace-nowrap",
    scheme === "dark" ? "text-white" : "text-black",
  );
const ExternalLinks = ({ scheme }: { scheme: "light" | "dark" }) => (
  <ul
    className={classnames(
      "z-30 overflow-hidden bg-white/50 backdrop-blur-lg",
      "rounded shadow-lg border border-gray-400 font-serif",
    )}
  >
    <li>
      {/* eslint-disable-next-line */}
      <a
        className={classnames(
          navClasses("light"),
          "bg-buzzwordsLightBg hover:bg-gray-300",
        )}
        href="https://buzzwords.gg"
        target="_blank"
      >
        <StaticImage
          alt="buzzwords icon"
          className="mr-2"
          placeholder="none"
          src="../images/buzzwords_icon.png"
          style={{ height: "25px", width: "25px" }}
        />
        Buzzwords
      </a>
    </li>
    <li>
      <a
        className={navClasses(scheme)}
        href="https://bsky.app/profile/chuckdries.com"
        rel="noreferrer"
        target="_blank"
      >
        Bluesky
      </a>
    </li>
    {/* <li>
      <a
        className={navClasses(scheme)}
        href="https://chuckdries.darkroom.com/"
        rel="noreferrer"
        target="_blank"
      >
        Prints
      </a>
    </li> */}
    {/* <li>
      <a
        className={navClasses(scheme)}
        href="https://twitter.com/chuckletmilk"
        rel="noreferrer"
        target="_blank"
      >
        Twitter
      </a>
    </li> */}
    <li>
      <a
        className={navClasses(scheme)}
        href="https://www.instagram.com/chuck.dries.photo/"
        rel="noreferrer"
        target="_blank"
      >
        Instagram
      </a>
    </li>
    <li>
      <a
        className={navClasses(scheme)}
        href="https://www.youtube.com/channel/UCknR_DdytuOgzus--b2gZhg"
        rel="noreferrer"
        target="_blank"
      >
        YouTube
      </a>
    </li>
    <li>
      <a
        className={navClasses(scheme)}
        href="https://github.com/chuckdries"
        rel="noreferrer"
        target="_blank"
      >
        GitHub
      </a>
    </li>
    {/* <li>
      <a
        className={navClasses(scheme)}
        href="https://hachyderm.io/@chuckletmilk"
        rel="me noreferrer"
        target="_blank"
      >
        Mastodon
      </a>
    </li> */}

    <li>
      <a className={navClasses(scheme)} href="mailto:chuck@chuckdries.com">
        chuck@chuckdries.com
      </a>
    </li>
  </ul>
);

interface NavProps {
  className?: string;
  // internalLinks: {
  //   href: string;
  //   label: string;
  // }[];
  scheme?: "dark" | "light";
  compact?: boolean;
}

const Nav = ({ className, scheme: _scheme, compact }: NavProps) => {
  const [linksMenu, setLinksMenu] = useState(false);
  const faceClicks = useRef(0);
  const faceLastClicked = useRef(0);
  const scheme = _scheme ?? "light";

  return (
    <nav
      className={classnames(
        compact ? "my-0 px-4" : "py-4 px-4 lg:px-8",
        "flex flex-col-reverse lg:flex-row",
        "justify-between",
        "items-center w-full font-serif",
        className,
      )}
    >
      <div className="flex flex-auto items-center">
        {!compact && (
          <div
            className={classnames(
              "h-[60px] w-[60px] lg:w-[100px] lg:h-[100px] mr-4 my-5 flex-shrink-0",
            )}
            onClick={() => {
              const prevClick = faceLastClicked.current;
              faceLastClicked.current = Date.now();
              if (prevClick > 0 && faceLastClicked.current - prevClick > 500) {
                console.log("too slow!");
                faceClicks.current = 1;
                return;
              }
              if (faceClicks.current === 4) {
                navigate("/photos/?debug=true");
                return;
              }
              faceClicks.current += 1;
            }}
          >
            <StaticImage
              alt="A picture of me"
              className="relative"
              placeholder="none"
              src="../images/circle-profile.png"
              style={
                {
                  // top: "-70%",
                  // left: "-50%",
                  // width: "200%",
                }
              }
            />
          </div>
        )}
        <div className="items-baseline">
          <h1 className="font-bold mr-2">Chuck Dries</h1>
          {!compact && (
            <h2 className="text-md">Software Engineer & Photographer</h2>
          )}
        </div>
      </div>

      <div className="flex">
        <ul className="flex">
          <li>
            <Link
              activeClassName="underline"
              className={navClasses(scheme)}
              to="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              activeClassName="underline"
              className={navClasses(scheme)}
              to="/photos"
            >
              Photos
            </Link>
          </li>
          <li>
            <Link
              activeClassName="underline"
              className={navClasses(scheme)}
              partiallyActive
              to="/posts"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              activeClassName="underline"
              className={navClasses(scheme)}
              to="/projects"
            >
              Projects
            </Link>
          </li>
          {/* <li>
            <a
              rel="noreferrer"
              target="_blank"
              className={navClasses(scheme)}
              href="https://cohost.org/chuck/"
            >
              Blog
            </a>
          </li> */}
        </ul>
        <Popover
          containerClassName="z-30 p-1"
          content={<ExternalLinks scheme={scheme} />}
          isOpen={linksMenu}
          onClickOutside={() => setLinksMenu(false)}
          positions={["bottom"]} // preferred positions by priority
        >
          <button
            className={classnames(
              "hover:underline inline-flex align-middle items-center",
              navClasses(scheme),
            )}
            onClick={() => setLinksMenu(!linksMenu)}
          >
            Links
          </button>
        </Popover>
      </div>
      {/* {linksMenu && } */}
    </nav>
  );
};

export default Nav;
