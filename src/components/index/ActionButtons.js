import React from "react";
import classnames from "classnames";
import { Link } from "gatsby";

const getButtonClasses = (isClient) =>
  classnames(
    "z-20 rounded-md text-md inline-block px-2 py-1 mt-1 md:py-2 md:px-3 md:my-1 mr-2 text-md hover:underline",
    isClient &&
      `text-muted-light bg-muted-dark hover:bg-muted blurred-or-opaque-bg-2`
  );

const ActionButtons = ({ isClient, image, shuffleImage }) => (
  <div className="flex mx-6 mb-6">
    <Link
      className={getButtonClasses(isClient, "muted")}
      id="image-link"
      title="view image details"
      to={`/photogallery/${image.base}/`}
    >
      <span className="icon-offset">
        <ion-icon name="image"></ion-icon>
      </span>
    </Link>
    <button
      className={getButtonClasses(isClient, "muted")}
      id="shuffle-button"
      onClick={() => {
        shuffleImage(image);
      }}
      title="shuffle image"
      type="button"
    >
      <span className="icon-offset">
        <ion-icon name="shuffle"></ion-icon>
      </span>
    </button>
    <Link
      className={getButtonClasses(isClient, "muted")}
      id="photogallery-link"
      to="/photogallery/"
    >
      Photography Gallery
    </Link>
  </div>
);

export default ActionButtons;