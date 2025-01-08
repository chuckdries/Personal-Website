import React from "react";
import PhotosPage from "../pages/photos";
import PhotosPageJSON from "../../public/page-data/photos/page-data.json";

interface PageRendererProps {
  match: {
    route: {
      path: string;
    };
    params: {
      [key: string]: string;
    };
    uri: string;
  };
}

const PageRenderer = ({ match }: PageRendererProps) => {
  switch (match.route.path) {
    case "/photos/:slug/":
      return (
        // @ts-expect-error dont need the extra props
        <PhotosPage
          data={PhotosPageJSON?.result?.data as Queries.AllPhotoGroupedQuery}
        />
      );
    default:
      return null;
  }
};

export default PageRenderer;
