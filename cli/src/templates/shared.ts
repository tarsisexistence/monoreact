export const BASE_PACKAGE_SCRIPTS = {
  start: 'npx rollup -cw',
  build: 'npx rollup -c',
  test: 'jest --passWithNoTests',
  'lint:es': 'eslint src/**/*.{js,jsx,ts,tsx}'
};

export const COMPONENT_PACKAGE_SCRIPTS = {
  ...BASE_PACKAGE_SCRIPTS,
  'lint:css': 'stylelint src/**/*.{css,sass,scss}',
  'start:docz': 'docz dev -p 6010',
  'start:playground':
    'yarn build & concurrently --kill-others "yarn start" "cd playground & yarn start"'
};

export const REACT_TEMPLATE_DEPENDENCIES = {
  peerDependencies: {
    react: '>=16',
    'react-dom': '>=16'
  }
};

export const BASE_PACKAGE_JSON = {
  // name: safeName,
  // author: author,
  version: '0.1.0',
  license: 'MIT',
  main: 'dist/bundle.cjs.js',
  module: 'dist/bundle.esm.js',
  'jsnext:main': 'dist/bundle.esm.js',
  types: 'dist/publicApi.d.ts',
  input: 'src/publicApi.js',
  publishConfig: {
    access: 'public'
  }
};
