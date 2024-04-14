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
          className="bg-neutral-900 text-white transition-colors"
          // @ts-expect-error not a style prop
          style={getHelmetSafeBodyStyle({
            // @ts-expect-error not a style prop
            "--dark-vibrant": `25, 25, 25`,
          })}
        />
      </Helmet>
      {!omitNav && (
        <div className="">
          <Nav className="mb-4" scheme="dark" />
        </div>
      )}
      {children}
    </div>
  );
}
