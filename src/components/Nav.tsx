import React, { useRef, useState } from "react";
import classnames from "classnames";
import { Link, navigate } from "gatsby";
import { Popover } from "react-tiny-popover";
import { StaticImage } from "gatsby-plugin-image";

const navClasses = (scheme: "light" | "dark") => classnames(
  "hover:underline hover:bg-black/10 block p-3 flex-shrink-0 whitespace-nowrap",
  scheme === "dark" ? "text-white" : "text-black"
)
const ExternalLinks = ({ scheme }: { scheme: "light" | "dark"}) => (
  <ul
    className={classnames(
      "z-30 overflow-hidden bg-vibrant-dark/50 backdrop-blur-lg",
      "rounded shadow-lg border border-gray-400"
    )}
  >
    <li>
      {/* eslint-disable-next-line */}
      <a className={classnames(navClasses('light'), 'bg-buzzwordsLightBg hover:bg-gray-300')} href="https://buzzwords.gg" target="_blank">
        <StaticImage alt="buzzwords icon" className="mr-2" placeholder="none" src="../images/buzzwords_icon.png" style={{ height: '30px', width: '30px' }} />
        Buzzwords
      </a>
    </li>
    <li>
      <a
        className={navClasses(scheme)}
        href="https://twitter.com/chuckletmilk"
        rel="noreferrer"
        target="_blank"
      >
        Twitter
      </a>
    </li>
    <li>
      <a
        className={navClasses(scheme)}
        href="https://www.instagram.com/asubtlebutdeliciouscoffeecake/"
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
    <li>
      <a
        className={navClasses(scheme)}
        href="https://hachyderm.io/@chuckletmilk"
        rel="me noreferrer"
        target="_blank"
      >
        Mastodon
      </a>
    </li>
    <li>
      <a className={navClasses(scheme)} href="mailto:chuck@chuckdries.com">
        chuck@chuckdries.com
      </a>
    </li>
  </ul>
);

interface NavProps {
  className?: string;
  internalLinks: {
    href: string;
    label: string;
  }[];
  scheme?: "dark" | "light"
}

const Nav = ({ internalLinks, className, scheme: _scheme }: NavProps) => {
  const [linksMenu, setLinksMenu] = useState(false);
  const faceClicks = useRef(0);
  const faceLastClicked = useRef(0);
  const scheme = _scheme ?? "light"

  return (
    <nav
      className={classnames(
        "my-4 flex flex-col-reverse md:flex-row",
        "justify-between",
        "items-center w-full font-sans px-4 md:px-8",
        className
      )}
    >
      <div className="flex flex-auto items-center">
        <div
          className={classnames(
            "h-[120px] w-[120px] mr-4 my-5 flex-shrink-0"
          )}
          onClick={() => {
            const prevClick = faceLastClicked.current;
            faceLastClicked.current = Date.now();
            if (prevClick > 0 && faceLastClicked.current - prevClick > 500) {
              console.log('too slow!')
              faceClicks.current = 1;
              return;
            }
            if (faceClicks.current === 4) {
              navigate("/photogallery/?debug=true");
              return;
            }
            faceClicks.current += 1;
          }}
        >
          <StaticImage
            alt="A picture of me"
            className="relative"
            placeholder="tracedSVG"
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
        <div className="items-baseline">
          <h1 className="font-bold mr-2">Chuck Dries</h1>
          <h2 className="text-md">Software Engineer & Photographer</h2>
        </div>
      </div>

      <div className="flex">
        <ul className="flex">
          {internalLinks &&
            internalLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  activeClassName="font-bold underline"
                  className={navClasses(scheme)}
                  to={href}
                >
                  {label}
                </Link>
              </li>
            ))}
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
              navClasses(scheme)
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
