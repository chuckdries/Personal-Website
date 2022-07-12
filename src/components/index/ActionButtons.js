import React from "react";
import classnames from "classnames";
import { Link } from "gatsby";

import Shuffle from "@spectrum-icons/workflow/Shuffle";

const getButtonClasses = (isClient) =>
  classnames(
    "z-20 rounded-md text-md inline-block px-2 py-1 mt-1 mr-2 text-md hover:underline",
    isClient ? "cool-border-small hover:bg-vibrant" : "text-gray-300 bg-gray-700"
  );

const ActionButtons = ({ isClient, image, shuffleImage }) => (
  <div className="flex flex-col">
    <div className="text-muted-light p-1 sm:p-4 m-1 sm:m-4 bg-muted-dark rounded-xl flex flex-col text-center z-10 cool-border-small-light">
      <h3 className="sm:mb-2 drop-shadow">Try my word game!</h3>
      <a
        className="rounded-full bg-muted-light hover:bg-vibrant text-muted-dark p-1 sm:p-2"
        href="https://buzzwords.gg"
      >
        Buzzwords
      </a>
    </div>
    <div className="flex sm:mx-6 mb-2 sm:mb-6">
      <Link
        className={getButtonClasses(isClient, "muted")}
        id="image-link"
          to={`/photogallery/${image.base}/`}
        >
          view image
        </Link>
      <button
        className={getButtonClasses(isClient, "muted")}
        id="shuffle-button"
        onClick={() => {
          shuffleImage(image);
        }}
        type="button"
      >
        <Shuffle UNSAFE_className="mr-1" aria-label="shuffle image" size="XS" />
        background
      </button>
    </div>
  </div>
);

export default ActionButtons;
