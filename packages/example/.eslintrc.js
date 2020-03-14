const path = require('path');

module.exports = {
  extends: path.resolve(__dirname, '../../.eslintrc.js'),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      path.resolve(__dirname, '../../settings/tsconfig.test.json'),
      path.resolve(__dirname, './tsconfig.json')
    ]
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, './src')],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
