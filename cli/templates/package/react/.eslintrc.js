const path = require('path');

module.exports = {
  extends: '../.eslintrc.js',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: path.resolve(__dirname, './tsconfig.json')
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, './src')],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: {
    'no-console': 0,
    'max-classes-per-file': 0
  }
};
