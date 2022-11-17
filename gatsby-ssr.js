import * as React from "react";
import { lightTheme, Provider } from "@adobe/react-spectrum";
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
      colorScheme="light"
      // scale="medium"
      theme={lightTheme}
    >
      {element}
    </Provider>
  </SSRProvider>
);