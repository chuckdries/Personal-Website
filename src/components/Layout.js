import * as React from "react";
import { Helmet } from "react-helmet";
import GlobalNav from "./GlobalNav";
import classNames from "classnames";
import { MDXProvider } from "@mdx-js/react";

const ContentContainer = ({ ...props }) => (
  <div className="content-container mx-auto" {...props} />
);

const Paragraph = ({ className, ...props }) => (
  <ContentContainer>
    <p className={classNames("max-w-[600px] my-4", className)} {...props} />
  </ContentContainer>
);

const H1 = ({ className, ...props }) => (
  <ContentContainer>
    <h1 className={classNames("font-bold", className)} {...props} />
  </ContentContainer>
);

export const components = {
  p: Paragraph,
  h1: H1,
};

const Layout = ({ pageTitle, children, className }) => {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <GlobalNav />
      <MDXProvider components={components}>
        <main className={className}>
          <div>{children}</div>
        </main>
      </MDXProvider>
    </>
  );
};

export default Layout;
