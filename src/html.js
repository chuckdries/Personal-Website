import React from "react";
import PropTypes from "prop-types";

const env =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta content="ie=edge" httpEquiv="x-ua-compatible" />
        <meta
          content="Chuck Dries: Full Stack Software Engineer and Photographer"
          name="description"
        />
        <meta
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
          name="viewport"
        />
        {props.headComponents}
        {env === "production" && (
          <script
            async
            data-domain="chuckdries.com"
            defer
            src="https://analytics.chuckdries.com/js/plausible.outbound-links.js"
          ></script>
        )}
        {/* eslint-disable-next-line */}
        {env === "production" && (
          <script>{`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}</script>
        )}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          dangerouslySetInnerHTML={{ __html: props.body }}
          id="___gatsby"
          key={"body"}
        />
        {props.postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
