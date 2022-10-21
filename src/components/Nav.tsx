import React, { useState } from "react";
import classnames from "classnames";
import { Link } from "gatsby";
import useDimensions from "react-cool-dimensions";

import Menu from "@spectrum-icons/workflow/Menu";

const navClasses = "hover:underline hover:bg-gray-900 block p-3 text-gray-200";

const ExternalLinks = ({ isVertical }: { isVertical: boolean }) => (
  <ul
    className={classnames(
      "z-30 bg-black rounded overflow-hidden",
      isVertical
        ? "inline-flex flex-wrap justify-center"
        : "absolute rounded-md top-[40px] border border-white"
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
  const { observe, currentBreakpoint } = useDimensions({
    breakpoints: { XS: 0, LG: 690 },
    updateOnBreakpointChange: true,
  });
  const [linksMenu, setLinksMenu] = useState(false);

  return (
    <nav
      className={classnames(
        "mt-0 flex justify-center w-full font-serif",
        "text-gray-200 bg-black shadow-lg",
        className
      )}
      ref={observe}
      style={{ zIndex: 100 }}
    >
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
        {internalLinks && currentBreakpoint !== "XS" && (
          <span className="block p-3 text-gray-200">|</span>
        )}
        {currentBreakpoint === "XS" && (
          <button
            className={classnames(
              "mx-2 hover:underline inline-flex align-middle items-center",
              navClasses
            )}
            onClick={() => setLinksMenu(!linksMenu)}
          >
            <Menu
              UNSAFE_className="mr-1"
              aria-label="show external links"
              size="S"
            />
            Links
          </button>
        )}
        {(currentBreakpoint !== "XS" || linksMenu) && (
          <ExternalLinks isVertical={currentBreakpoint !== "XS"} />
        )}
      </div>
    </nav>
  );
};

export default Nav;
