import React, { useState } from "react";
import classnames from "classnames";
import { Link } from "gatsby";
import { Popover } from "react-tiny-popover";

const navClasses =
  "hover:underline hover:bg-transparentblack block p-3 text-black";

const ExternalLinks = () => (
  <ul
    className={classnames(
      "z-30 overflow-hidden bg-vibrant-dark",
      "rounded shadow border border-vibrant-light"
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
      <a
        className={navClasses}
        href="https://hachyderm.io/@chuckletmilk"
        rel="me noreferrer"
        target="_blank"
      >
        Mastodon
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
  const [linksMenu, setLinksMenu] = useState(false);

  return (
    <nav
      className={classnames(
        "my-4 flex flex-col-reverse md:flex-row items-center w-full font-sans px-4 md:px-8",
        className
      )}
    >
      <div className="md:flex items-baseline flex-auto">
        <h1 className="font-bold mr-2">Chuck Dries</h1>
        <h2 className="text-md">Software Engineer & Photographer</h2>
      </div>

      <div className="flex">
        <ul className="flex">
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
        <Popover
          containerClassName="z-30 p-1"
          content={<ExternalLinks />}
          isOpen={linksMenu}
          onClickOutside={() => setLinksMenu(false)}
          positions={["bottom"]} // preferred positions by priority
        >
          <button
            className={classnames(
              "hover:underline inline-flex align-middle items-center",
              navClasses
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
