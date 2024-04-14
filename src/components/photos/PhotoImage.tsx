import { Link, PageProps, graphql, navigate } from "gatsby";
import React, { useEffect } from "react";
import { PhotoLayout } from "./PhotoLayout";
import { GatsbyImage } from "gatsby-plugin-image";
import { Helmet } from "react-helmet";
import Nav from "../Nav";
import { getHelmetSafeBodyStyle, getVibrantStyle } from "../../utils";

function PhotoImage({
  pageContext,
  data,
}: PageProps<Queries.PhotoImageQuery, { imageId: string }>) {
  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(-1);
      }
    };
    document.addEventListener("keydown", keyListener);
    return () => {
      document.removeEventListener("keydown", keyListener);
    };
  }, []);
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      <Helmet>
        <title>Photos | Chuck Dries</title>
        <body
          className="bg-neutral-900 text-white"
          // @ts-expect-error not a style prop
          style={getHelmetSafeBodyStyle({
            // @ts-expect-error not a style prop
            "--dark-vibrant": `25, 25, 25`,
          })}
        />
      </Helmet>
      <Nav className="mb-0" compact scheme="dark" />
      {/* <div className="flex-auto "> */}
      <GatsbyImage
        alt="photo"
        objectFit="contain"
        image={data.image!.childImageSharp!.gatsbyImageData}
        // className="h-full w-full object-contain"
        className="h-full"
      />
      <div className="absolute bottom-0 right-0 p-4 ">
        <a
          className="cursor-pointer font-sans px-3 py-2 rounded text-white bg-neutral-700/50 hover:bg-neutral-800"
          download
          href={data.image!.publicURL!}
          onClick={() => {
            try {
              window.plausible("Download Wallpaper", {
                props: { image: data.image!.base },
              });
            } catch {
              // do nothing
            }
          }}
        >
          Download wallpaper
        </a>
      </div>
    </div>
  );
}

export default PhotoImage;

export const query = graphql`
  query PhotoImage($imageId: String) {
    image: file(id: { eq: $imageId }) {
      id
      publicURL
      base
      relativePath
      childImageSharp {
        gatsbyImageData(placeholder: BLURRED)
      }
    }
  }
`;
