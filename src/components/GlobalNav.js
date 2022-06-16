import classNames from "classnames";
import { Link as GatsbyLink } from "gatsby";
import React from "react";

const Link = ({ clasName, ...props }) => (
  <GatsbyLink
    className={classNames(
      clasName,
      "hover:underline text-vibrant-light hover:text-muted-light mx-1"
    )}
    {...props}
  />
);

const GlobalNav = ({ nextImage, prevImage }) => (
  <nav className="mt-1 ml-1 text-lg mb-4">
    <Link to="/">Home</Link>
    <div
      className={classNames(
        'inline',
        (nextImage || prevImage) && "p-2 mx-1 border rounded"
      )}
    >
      {prevImage && (
        <Link
          className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
          to={`/photogallery/${prevImage}/`}
        >
          previous <kbd>&#11104;</kbd>
        </Link>
      )}
      <Link to="/photogallery/">
        Gallery {(prevImage || nextImage) && <kbd>esc</kbd>}
      </Link>
      {nextImage && (
        <Link
          className="hover:underline text-vibrant-light hover:text-muted-light mx-1"
          to={`/photogallery/${nextImage}/`}
        >
          next <kbd>&#11106;</kbd>
        </Link>
      )}
    </div>
  </nav>
);

export default GlobalNav;
