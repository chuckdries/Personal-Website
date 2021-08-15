import React from 'react';
import classnames from 'classnames';

const getNavClasses = (isClient) =>
  classnames("hover:underline mx-2 md:mx-3", isClient && "text-vibrant-light");

const Nav = ({ ar, isClient }) => (
  <nav
    className={classnames(
      ar > 1 || !isClient ? "landscape:w-screen" : "portrait:w-screen",
      "p-2 flex justify-center",
      isClient && "bg-vibrant-dark blurred-or-opaque-bg-2"
    )}
    style={{ zIndex: 100 }}
  >
    <ul className="inline-flex flex-wrap justify-center">
      <li>
        <a
          className={getNavClasses(isClient)}
          href="/CharlesDriesResumeCurrent.pdf"
        >
          Resume
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
      <li>
        <a
          className={getNavClasses(isClient)}
          href="https://www.linkedin.com/in/chuckdries/"
        >
          LinkedIn
        </a>
      </li>
      <li>
        <a
          className={getNavClasses(isClient)}
          href="https://devpost.com/chuckdries"
        >
          Devpost
        </a>
      </li>
      <li>
        <a
          className={getNavClasses(isClient)}
          href="https://medium.com/@chuckdries"
        >
          Medium (blog)
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
          href="mailto:chuck@chuckdries.com"
        >
          chuck@chuckdries.com
        </a>
      </li>
    </ul>
  </nav>
);

export default Nav;