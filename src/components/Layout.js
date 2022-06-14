import * as React from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import GlobalNav from "./GlobalNav";

const Layout = ({ pageTitle, children }) => {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <GlobalNav />
      <main>
        <div className="container mx-auto">{children}</div>
      </main>
    </>
  );
};

export default Layout;
