import React, { useState } from "react";
import classnames from "classnames";
import { Link } from "gatsby";
import useDimensions from "react-cool-dimensions";

import Menu from "@spectrum-icons/workflow/Menu";

interface NavProps {
  isClient?: boolean;
  className?: string;
  internalLinks: {
    href: string;
    label: string;
  }[]
}

const Nav = ({ isClient, internalLinks, className }: NavProps) => {
  const { observe, currentBreakpoint } = useDimensions({
    breakpoints: { XS: 0, LG: 690 },
    updateOnBreakpointChange: true,
  });
  const [linksMenu, setLinksMenu] = useState(false);

  const navClasses = classnames(
    "hover:underline mx-2 md:mx-3",
    isClient ? "text-vibrant-light" : "text-gray-200"
  );
  return (
    <nav
      className={classnames(
        "m-2 flex justify-center font-sans w-full",
        isClient ? "text-vibrant-light" : "text-gray-200",
        className
      )}
      ref={observe}
      style={{ zIndex: 100 }}
    >
      <div
        className={classnames(
          "rounded-full p-2",
          isClient
            ? "bg-vibrant-dark cool-border-small-light"
            : "border border-white"
        )}
      >
        {/* <ul className="inline-flex flex-wrap justify-center">
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
        {internalLinks && currentBreakpoint !== "XS" && <>|</>} */}
        {currentBreakpoint === "XS" && (
          <button
            className="mx-2 hover:underline inline-flex align-middle"
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
          <ul
            className={classnames(
              "z-30",
              currentBreakpoint !== "XS"
                ? "inline-flex flex-wrap justify-center"
                : "absolute p-2 rounded-md mt-2",
              currentBreakpoint === "XS" &&
                (isClient
                  ? "bg-vibrant-dark cool-border-small-light"
                  : "bg-black border border-white")
            )}
          >
            <li>
              <a className={navClasses} href="https://buzzwords.gg">
                Buzzwords
              </a>
            </li>
            <li>
              <a className={navClasses} href="https://twitter.com/chuckletmilk">
                Twitter
              </a>
            </li>
            <li>
              <a
                className={navClasses}
                href="https://www.instagram.com/asubtlebutdeliciouscoffeecake/"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                className={navClasses}
                href="https://www.youtube.com/channel/UCknR_DdytuOgzus--b2gZhg"
              >
                YouTube
              </a>
            </li>
            <li>
              <a className={navClasses} href="https://github.com/chuckdries">
                GitHub
              </a>
            </li>
            <li>
              <a className={navClasses} href="mailto:chuck@chuckdries.com">
                chuck@chuckdries.com
              </a>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Nav;
