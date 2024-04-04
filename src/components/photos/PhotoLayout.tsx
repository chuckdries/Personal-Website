import React from "react";
import { Helmet } from "react-helmet";
import Nav from "../Nav";

export function PhotoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Helmet>
        <title>Photos | Chuck Dries</title>
        <body className="bg-neutral-900 text-white" />
      </Helmet>
      <div className="pr-[120px]">

      <Nav
        className="mb-4"
        scheme="dark"
      />
      </div>
      {children}
    </div>
  );
}
