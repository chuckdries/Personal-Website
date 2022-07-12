import preval from "babel-plugin-preval/macro";
const themeBreakpoints = preval`
const R = require('ramda')
const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../tailwind.config.js');
const {theme} = resolveConfig(tailwindConfig);
module.exports = R.pipe(
  R.map(size => parseInt(size, 10)),
  R.filter(Boolean)
)(theme.screens);
`;

export default themeBreakpoints;
