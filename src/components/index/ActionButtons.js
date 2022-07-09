import React from "react";
import classnames from "classnames";
import { Link } from "gatsby";

import Image from "@spectrum-icons/workflow/Image";
import Shuffle from "@spectrum-icons/workflow/Shuffle";

const getButtonClasses = (isClient) =>
  classnames(
    "z-20 rounded-md text-md inline-block px-2 py-1 mt-1 md:py-2 md:px-3 md:my-1 mr-2 text-sm hover:underline text-black",
    isClient ? "cool-border-small hover:bg-vibrant" : "text-white"
  );

const ActionButtons = ({ isClient, image, shuffleImage }) => (
  <div className="flex flex-col">
    <div className="text-muted-light p-4 m-2 bg-muted-dark rounded-xl flex flex-col text-center z-10 cool-border-small-light">
      <h3 className="mb-2 drop-shadow">Try my word game!</h3>
      <a
        className="rounded-full bg-muted-light hover:bg-vibrant text-muted-dark p-2"
        href="https://buzzwords.gg"
      >
        Buzzwords
      </a>
    </div>
    <div className="flex justify-center mx-6 mb-6">
      <Link
        className={getButtonClasses(isClient)}
        id="image-link"
          title="view image details"
          to={`/photogallery/${image.base}/`}
        >
          <Image aria-label="view image details" size="S" />
        </Link>
      <button
        className={getButtonClasses(isClient)}
        id="shuffle-button"
        onClick={() => {
          shuffleImage(image);
        }}
        title="shuffle image"
        type="button"
      >
        <Shuffle aria-label="shuffle image" size="S" />
      </button>
    </div>
  </div>
);

export default ActionButtons;
