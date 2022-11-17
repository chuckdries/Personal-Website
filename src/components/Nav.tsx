import React, { useState } from "react";
import classnames from "classnames";
import { Link } from "gatsby";
import useDimensions from "react-cool-dimensions";

import Menu from "@spectrum-icons/workflow/Menu";

const navClasses =
  "hover:underline hover:bg-transparentblack block p-3 text-vibrant-light";

const ExternalLinks = () => (
  <ul
    className={classnames(
      "z-30 overflow-hidden bg-vibrant-dark",
      "absolute top-[40px] border border-vibrant-light"
    )}
  >
    <li>
      {/* eslint-disable-next-line */}
      <a className={navClasses} href="https://buzzwords.gg" target="_blank">
        Buzzwords
      </a>
    </li>
    <li>
      <a
        className={navClasses}
        href="https://twitter.com/chuckletmilk"
        rel="noreferrer"
        target="_blank"
      >
        Twitter
      </a>
    </li>
    <li>
      <a
        className={navClasses}
        href="https://www.instagram.com/asubtlebutdeliciouscoffeecake/"
        rel="noreferrer"
        target="_blank"
      >
        Instagram
      </a>
    </li>
    <li>
      <a
        className={navClasses}
        href="https://www.youtube.com/channel/UCknR_DdytuOgzus--b2gZhg"
        rel="noreferrer"
        target="_blank"
      >
        YouTube
      </a>
    </li>
    <li>
      <a
        className={navClasses}
        href="https://github.com/chuckdries"
        rel="noreferrer"
        target="_blank"
      >
        GitHub
      </a>
    </li>
    <li>
      <a className={navClasses} href="mailto:chuck@chuckdries.com">
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
}

const Nav = ({ internalLinks, className }: NavProps) => {
  // const { observe, currentBreakpoint } = useDimensions({
  //   breakpoints: { XS: 0, LG: 750 },
  //   updateOnBreakpointChange: true,
  // });
  const [linksMenu, setLinksMenu] = useState(false);

  return (
    <nav
      className={classnames(
        "mt-0 flex justify-between items-center w-full font-sans px-6",
        className
      )}
      // ref={observe}
      style={{ zIndex: 100 }}
    >
      <div className="flex items-baseline">
        <h1 className="font-bold mr-2">Chuck Dries</h1>
        <h2>Software Engineer & Photographer</h2>
      </div>
      <div className="flex">
        <ul className="inline-flex flex-wrap justify-center">
          {internalLinks &&
            internalLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  activeClassName="font-bold underline"
                  className={navClasses}
                  to={href}
                >
                  {label}
                </Link>
              </li>
            ))}
        </ul>
        <button
          className={classnames(
            "hover:underline inline-flex align-middle items-center",
            navClasses
          )}
          onClick={() => setLinksMenu(!linksMenu)}
        >
          {/* <Menu
            UNSAFE_className="mr-1"
            aria-label="show external links"
            size="S"
          /> */}
          Links
        </button>
        {linksMenu && <ExternalLinks />}
      </div>
    </nav>
  );
};

export default Nav;
