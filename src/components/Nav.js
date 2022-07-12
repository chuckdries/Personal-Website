import React from "react";
import classnames from "classnames";
import { Link } from "gatsby";

const getNavClasses = (isClient) =>
  classnames(
    "hover:underline mx-2 md:mx-3",
    isClient ? "text-vibrant-light" : "text-gray-200"
  );

const Nav = ({ isClient, internalLinks, className }) => (
  <nav
    className={classnames(
      "m-2 flex justify-center font-sans",
      isClient ? "text-vibrant-light" : "text-gray-200",
      className
    )}
    style={{ zIndex: 100 }}
  >
    <div
      className={classnames(
        "rounded-full p-2 ]",
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
        {internalLinks && <>|</>}
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
    </div>
  </nav>
);

export default Nav;
