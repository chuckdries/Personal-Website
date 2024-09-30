import React from "react";
import { Helmet } from "react-helmet";
import Nav from "../Nav";
import { getHelmetSafeBodyStyle } from "../../utils";

export function PhotoLayout({
  children,
  omitNav,
}: {
  children: React.ReactNode;
  omitNav?: boolean;
}) {
  return (
    <div className="flex flex-col h-[100svh]">
      <Helmet>
        <title>Photos | Chuck Dries</title>
        <body
          className="bg-white text-black transition-colors"
          // @ts-expect-error not a style prop
          style={getHelmetSafeBodyStyle({
            "--dark-vibrant": `255, 255, 255`,
          })}
        />
      </Helmet>
      {!omitNav && (
        <div className="">
          <Nav className="mb-4" scheme="light" />
        </div>
      )}
      {children}
    </div>
  );
}
