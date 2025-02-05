// import * as React from "react";
import "./src/styles/global.css";

declare global {
  interface Window {
    plausible: any;
  }
}

const env =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";
export const onRouteUpdate = function () {
  if (env === "production" && typeof window.plausible === "object") {
    window.plausible("pageview");
  }
};

// docs say you can return a scroll position from this fn, but that's a bold-faced lie
export const shouldUpdateScroll = ({
  prevRouterProps,
  routerProps: { location },
  pathname,
}) => {
  if (pathname.startsWith('/photos')) {
    return false;
  }
  if (prevRouterProps?.location.pathname === pathname) {
    return false;
  }
  return true;
}

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

// export const wrapRootElement = ({ element }) => (
//   <SSRProvider>
//     <Provider
//       UNSAFE_className="overflow-x-hidden"
//       UNSAFE_style={{
//         background: "unset",
//         color: "unset",
//       }}
//       colorScheme="light"
//       // scale="medium"
//       theme={{light: {}, ...lightTheme}}
//     >
//       {element}
//     </Provider>
//   </SSRProvider>
// );

// {/* // <MDXProvider components={components}>{element}</MDXProvider> */}
