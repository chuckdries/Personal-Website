import * as React from "react";
import { darkTheme, defaultTheme, Provider } from "@adobe/react-spectrum";
import "./src/styles/global.css";
import { SSRProvider } from "@react-aria/ssr";

export const wrapRootElement = ({ element }) => (
  <SSRProvider>
    <Provider
      UNSAFE_style={{
        background: "unset",
        color: "unset",
      }}
      colorScheme="light"
      // scale="medium"
      theme={defaultTheme}
    >
      {element}
    </Provider>
  </SSRProvider>
);