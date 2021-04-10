const path = require('path');

module.exports = {
  ignorePatterns: ['*.*ss'],
  plugins: [
    '@typescript-eslint',
    'prettier',
    'react',
    'import',
    'react-hooks',
    'promise',
    'sonarjs',
    'jsx-a11y'
  ],
  extends: [
    'eslint:recommended',
    'react-app',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:compat/recommended',
    'plugin:promise/recommended',
    'plugin:sonarjs/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, 'src')],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    react: {
      version: 'detect'
    }
  },
  env: {
    browser: true,
    node: true,
    jest: true
  }
};
