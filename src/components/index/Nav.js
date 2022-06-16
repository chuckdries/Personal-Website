import React from "react";
import classnames from "classnames";
import { Link } from "gatsby";

const getNavClasses = (isClient) =>
  classnames(
    "hover:underline mx-2 md:mx-3",
    isClient ? "text-vibrant-light" : "text-gray-200"
  );

const Nav = ({ imageIsLandscape, isClient }) => (
  <nav
    className={classnames(
      // imageIsLandscape
      //   ? "landscape:w-screen portrait:rounded-3xl portrait:m-2"
      //   : "portrait:w-screen landscape:rounded-3xl landscape:m-2",
      "rounded-3xl m-2",
      "p-2 flex justify-center items-center",
      isClient && "bg-vibrant-dark cool-border-small-light"
    )}
    style={{ zIndex: 100 }}
  >
    <ul className="inline-flex flex-wrap justify-center">
      <li className="text-center">
        <Link className={getNavClasses(isClient)} to="/photogallery">Photography Gallery</Link>
      </li>
    </ul>
    <span className='text-gray-400 mx-2'>|</span>
    <ul className="inline-flex flex-wrap justify-center">
      {/* <li>
        <a
          className={getNavClasses(isClient)}
          href="/CharlesDriesResumeCurrent.pdf"
          onClick={() => {
            try {
              window.plausible("Resume Click");
            } catch {
              // do nothing
            }
          }}
        >
          Resume
        </a>
      </li> */}
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
          href="https://github.com/chuckdries"
        >
          Github
        </a>
      </li>
      {/* <li>
        <a
          className={getNavClasses(isClient)}
          href="https://www.linkedin.com/in/chuckdries/"
        >
          LinkedIn
        </a>
      </li> */}
      {/* <li>
        <a
          className={getNavClasses(isClient)}
          href="https://medium.com/@chuckdries"
        >
          Medium
        </a>
      </li> */}
      <li>
        <a
          className={getNavClasses(isClient)}
          href="https://www.youtube.com/channel/UCknR_DdytuOgzus--b2gZhg"
        >
          YouTube
        </a>
      </li>
      {/* <li>
        <a
          className={getNavClasses(isClient)}
          href="mailto:chuck@chuckdries.com"
        >
          chuck@chuckdries.com
        </a>
      </li> */}
    </ul>
  </nav>
);

export default Nav;
