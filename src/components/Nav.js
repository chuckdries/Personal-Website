import React, { useState } from "react";
import classnames from "classnames";
import { Link } from "gatsby";
import useDimensions from "react-cool-dimensions";

import ShowMenu from "@spectrum-icons/workflow/ShowMenu";

const getNavClasses = (isClient) =>
  classnames(
    "hover:underline mx-2 md:mx-3",
    isClient ? "text-vibrant-light" : "text-gray-200"
  );

const Nav = ({ isClient, internalLinks, className }) => {
  const { observe, currentBreakpoint } = useDimensions({
    breakpoints: { XS: 0, LG: 670 },
    updateOnBreakpointChange: true,
  });
  const [linksMenu, setLinksMenu] = useState(false);

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
        <ul className="inline-flex flex-wrap justify-center">
          {internalLinks &&
            internalLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  activeClassName="font-bold underline"
                  className={getNavClasses(isClient)}
                  to={href}
                >
                  {label}
                </Link>
              </li>
            ))}
        </ul>
        {internalLinks && currentBreakpoint === "LG" && <>|</>}
        {currentBreakpoint === "XS" && (
          <button
            className="ml-2 hover:underline inline-flex align-middle"
            onClick={() => setLinksMenu(!linksMenu)}
          >
            <ShowMenu
              UNSAFE_className="mr-2"
              aria-label="show external links"
              size="S"
            />
          </button>
        )}
        {(currentBreakpoint === "LG" || linksMenu) && (
          <ul
            className={classnames(
              currentBreakpoint === "LG"
                ? "inline-flex flex-wrap justify-center"
                : "fixed bg-vibrant-dark p-2 rounded-md cool-border-small-light right-4"
            )}
          >
            <li>
              <a
                className={getNavClasses(isClient)}
                href="https://twitter.com/chuckletmilk"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                className={getNavClasses(isClient)}
                href="https://www.instagram.com/asubtlebutdeliciouscoffeecake/"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                className={getNavClasses(isClient)}
                href="https://www.youtube.com/channel/UCknR_DdytuOgzus--b2gZhg"
              >
                YouTube
              </a>
            </li>
            <li>
              <a
                className={getNavClasses(isClient)}
                href="https://github.com/chuckdries"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                className={getNavClasses(isClient)}
                href="mailto:chuck@chuckdries.com"
              >
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
