const path = require('path');

module.exports = {
  extends: ['./.eslintrc.js', './cli/.eslintrc.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      path.resolve(__dirname, './tsconfig.json'),
      path.resolve(__dirname, './cli/tsconfig.json'),
      path.resolve(__dirname, './settings/tsconfig.test.json'),
      './packages/*/tsconfig.json'
    ]
  },
  ignorePatterns: ['playground/', '*.d.ts'],
  settings: {
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: 'packages/'
      },
      node: {
        paths: [
          path.resolve(__dirname, './src'),
          path.resolve(__dirname, './cli/src'),
          path.resolve(__dirname, './packages/example/src')
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
