import * as React from "react";
import { darkTheme, Provider } from "@adobe/react-spectrum";
import "./src/styles/global.css";
import { SSRProvider } from "@react-aria/ssr";

export const wrapRootElement = ({ element }) => (
  <SSRProvider>
    <Provider
      UNSAFE_style={{
        background: "unset",
        color: "unset",
      }}
      UNSAFE_className="overflow-x-hidden"
      colorScheme="dark"
      scale="medium"
      theme={darkTheme}
    >
      {element}
    </Provider>
  </SSRProvider>
);