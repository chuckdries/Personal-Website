import React from "react";
import { Helmet } from "react-helmet";
import Nav from "../Nav";
import { graphql, useStaticQuery } from "gatsby";

export function PostsLayout({
  children,
  title,
  description,
  cover,
}: {
  children: React.ReactNode;
  title?: string | null;
  description?: string | null;
  cover?: string | null;
}) {
  const { site } = useStaticQuery(graphql`
    query PostsLayoutMetaQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);
  return (
    <div className="flex flex-col h-actual-screen font-serif pb-8">
      <Helmet>
        <title>{title ?? "Posts"} | Chuck Dries</title>
        <body className="bg-white text-black transition-colors" />
        <meta
          content={
            description ?? "Full Stack Software Engineer and Photographer"
          }
          name="description"
        />
      </Helmet>
      {cover && (
        <Helmet>
          <meta
            content={`${site.siteMetadata.siteUrl}${cover}`}
            property="og:image"
          />
          <meta
            content={`${site.siteMetadata.siteUrl}${cover}`}
            name="twitter:image"
          />
        </Helmet>
      )}
      <Nav className="mb-4" scheme="light" />
      {children}
    </div>
  );
}
