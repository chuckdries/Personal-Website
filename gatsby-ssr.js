import * as React from "react";
import { darkTheme, Provider } from "@adobe/react-spectrum";
import "./src/styles/global.css";

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
