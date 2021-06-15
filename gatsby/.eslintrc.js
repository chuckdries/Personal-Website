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
  },
  'extends': [
    'eslint:recommended', // use recommended configs
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  'rules': {
    'react/prop-types': 0,
    'quotes': ['warn', 'single'],
    'semi': 1,
    'indent': ['warn', 2],
    'comma-dangle': ['warn', 'always-multiline'],
    'no-unused-vars': 1,
  },
};
