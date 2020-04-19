export const PACKAGE_JSON = 'package.json';

export const BASE_PACKAGE_SCRIPTS = {
  start: 're-space serve',
  build: 're-space build',
  test: 're-space test --passWithNoTests',
  'lint:esm': 're-space lint src/**/*.{js,jsx,ts,tsx}'
};

export const COMPONENT_PACKAGE_SCRIPTS = {
  ...BASE_PACKAGE_SCRIPTS,
  'lint:css': 'stylelint src/**/*.{css,sass,scss}'
};

export const REACT_TEMPLATE_DEPENDENCIES = {
  peerDependencies: {
    react: '*',
    'react-dom': '*'
  }
};

export const WORKSPACE_PACKAGE_JSON = {
  // name: safeName,
  // author: author,
  version: '0.1.0',
  module: 'dist/bundle.esm.js',
  'jsnext:main': 'dist/bundle.esm.js',
  types: 'dist/publicApi.d.ts',
  source: 'src/publicApi.ts',
  workspace: true,
  publishConfig: {
    access: 'public'
  }
};
