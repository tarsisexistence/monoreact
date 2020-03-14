const path = require('path');

module.exports = {
  // TODO: set dynamically
  extends: [
    path.resolve(__dirname, './.eslintrc.js')
    // path.resolve(__dirname, './cli/.eslintrc.js'),
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      path.resolve(__dirname, './tsconfig.json'),
      path.resolve(__dirname, './cli/tsconfig.json'),
      path.resolve(__dirname, './settings/tsconfig.workspace.json'),
      path.resolve(__dirname, './settings/tsconfig.test.json')
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
          // TODO: set dynamically
          path.resolve(__dirname, './src'),
          path.resolve(__dirname, './cli/src'),
          path.resolve(__dirname, './packages/example/src')
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
