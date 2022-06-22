import * as React from "react";
import { darkTheme, Provider } from "@adobe/react-spectrum";
import "./src/styles/global.css";

const env =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";
export const onRouteUpdate = function () {
  if (env === "production" && typeof window.plausible === "object") {
    window.plausible("pageview");
    // eslint-disable-next-line
    _paq.push(["setCustomUrl", "/" + window.location.pathname]);
    // eslint-disable-next-line
    _paq.push(["setDocumentTitle", document.title]);
    // eslint-disable-next-line
    _paq.push(["trackPageView"]);
  }
};
// import * as React from 'react';
// import { MDXProvider } from '@mdx-js/react';

// const MyH1 = props => <h1 style={{ color: 'tomato' }} {...props} />;
// const MyParagraph = props => (
//   <p style={{ fontSize: '18px', lineHeight: 1.6 }} {...props} />
// );

// const components = {
//   h1: MyH1,
//   p: MyParagraph,
// };


export const wrapRootElement = ({ element }) => (
  <Provider
    UNSAFE_style={{
      background: "transparent !important",
      color: 'unset !important'
    }}
    colorScheme="dark"
    theme={darkTheme}
  >
    {element}
  </Provider>
);


// {/* // <MDXProvider components={components}>{element}</MDXProvider> */}
