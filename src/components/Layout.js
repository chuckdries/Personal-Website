import * as React from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import GlobalNav from "./GlobalNav";
import classNames from "classnames";
import { MDXProvider } from "@mdx-js/react";

const Container = ({ ...props }) => (
  <div className="container mx-auto" {...props} />
);

const Paragraph = ({ className, ...props }) => (
  <Container>
    <p className={classNames("max-w-[600px] my-4", className)} {...props} />
  </Container>
);

const H1 = ({ className, ...props }) => (
  <Container>
    <h1 className={classNames("", className)} {...props} />
  </Container>
);

export const components = {
  p: Paragraph,
  h1: H1,
};

const Layout = ({ pageTitle, children }) => {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <GlobalNav />
      <MDXProvider components={components}>
        <main>
          <div>{children}</div>
        </main>
      </MDXProvider>
    </>
  );
};

export default Layout;
