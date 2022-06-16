import React from "react";
import classnames from "classnames";
import { Link } from "gatsby";

const getButtonClasses = (isClient) =>
  classnames(
    "z-20 rounded-md text-md inline-block px-2 py-1 mt-1 md:py-2 md:px-3 md:my-1 mr-2 text-md hover:underline text-black",
    isClient ? "cool-border-small hover:bg-vibrant" : "text-white"
  );

const ActionButtons = ({ isClient, image, shuffleImage }) => (
  <div className="flex flex-col">
    <div className="text-muted-light p-4 m-4 bg-muted-dark rounded-xl flex flex-col text-center z-10 cool-border-small-light">
      <h3 className="mb-2 drop-shadow">Try my word game!</h3>
      <a
        className="rounded-full bg-muted-light hover:bg-vibrant text-muted-dark p-2"
        href="https://buzzwords.gg"
      >
        Buzzwords
      </a>
    </div>
    {/* <div className="flex justify-center mx-6 mb-6">
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
    </div> */}
  </div>
);

export default ActionButtons;
