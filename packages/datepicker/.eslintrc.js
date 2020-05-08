const path = require('path');

module.exports = {
  extends: path.resolve(__dirname, '../../.eslintrc.js'),
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true
    }
  }
};
