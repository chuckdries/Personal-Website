import React from "react";
import { Helmet } from "react-helmet";
import Nav from "../Nav";
import { getHelmetSafeBodyStyle } from "../../utils";

export function PostsLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string | null;
  description?: string | null;
}) {
  return (
    <div className="flex flex-col h-actual-screen font-serif pb-8">
      <Helmet>
        <title>{title ?? "Posts"} | Chuck Dries</title>
        <body className="bg-white text-black transition-colors" />
        {/* {description && <meta content={description} name="description" />} */}
        {/* CQ TODO SEO component */}
      </Helmet>
      <Nav className="mb-4" scheme="light" />
      {children}
    </div>
  );
}
