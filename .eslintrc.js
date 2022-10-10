module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ['@typescript-eslint'],
  settings: {
    react: {
      version: "detect", // detect react version
    },
  },
  env: {
    node: true, // defines things like process.env when generating through node
    browser: true,
  },
  extends: [
    "eslint:recommended", // use recommended configs
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "no-undef": 0,
    "react/prop-types": 0,
    "no-unused-vars": 0,
    "react/jsx-sort-props": 1,
  },
};
