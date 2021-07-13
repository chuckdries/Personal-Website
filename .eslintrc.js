module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  'parser': 'babel-eslint', // uses babel-eslint transforms
  'settings': {
    'react': {
      'version': 'detect', // detect react version
    },
  },
  'env': {
    'node': true, // defines things like process.env when generating through node
    'browser': true
  },
  'extends': [
    'eslint:recommended', // use recommended configs
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  'rules': {
    'react/prop-types': 0,
    'no-unused-vars': 1,
    'react/jsx-sort-props': 1,
  },
};
