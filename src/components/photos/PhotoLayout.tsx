import React from "react";
import { Helmet } from "react-helmet";
import Nav from "../Nav";

export function PhotoLayout({ children, omitNav }: { children: React.ReactNode, omitNav?: boolean}) {
  return (
    <div className="flex flex-col h-screen">
      <Helmet>
        <title>Photos | Chuck Dries</title>
        <body className="bg-neutral-900 text-white" />
      </Helmet>
      {!omitNav && <div className="">
        <Nav className="mb-4" scheme="dark" />
      </div>}
      {children}
    </div>
  );
}
