import React from "react";
import { Helmet } from "react-helmet";
import Nav from "../Nav";
import { getHelmetSafeBodyStyle } from "../../utils";

export function PostsLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string | null;
}) {
  return (
    <div className="flex flex-col h-actual-screen font-serif">
      <Helmet>
        <title>{title ?? "Posts"} | Chuck Dries</title>
        <body className="bg-white text-black transition-colors" />
      </Helmet>
      <Nav className="mb-4" scheme="light" />
      {children}
    </div>
  );
}
