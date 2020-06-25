export const PACKAGE_JSON = 'package.json';
export const TSCONFIG_JSON = 'tsconfig.json';

export const BASE_PACKAGE_SCRIPTS: CLI.Package.Scripts = {
  start: 're-space serve',
  build: 're-space build',
  test: 're-space test --passWithNoTests',
  lint: 're-space lint "src/**/*.{js,jsx,ts,tsx}"',
  prepublishOnly: 'yarn build'
} as const;

export const REACT_PACKAGE_SCRIPTS: CLI.Package.Scripts = {
  ...BASE_PACKAGE_SCRIPTS,
  stylelint: 'npx stylelint "src/**/*.{css,sass,scss}"'
} as const;

export const REACT_TEMPLATE_DEPENDENCIES: Pick<CLI.Package.WorkspacePackageJSON, 'peerDependencies'> = {
  peerDependencies: {
    react: '*'
  }
};

export const WORKSPACE_PACKAGE_JSON: Omit<CLI.Package.WorkspacePackageJSON, 'scripts'> = {
  name: (undefined as unknown) as string,
  author: (undefined as unknown) as string,
  workspace: true,
  private: false,
  version: '0.1.0',
  module: 'dist/bundle.js',
  types: 'dist/publicApi.d.ts',
  source: 'src/publicApi.ts',
  publishConfig: {
    access: 'public'
  }
};

export const WORKSPACE_ROOT_PACKAGE_JSON: CLI.Package.WorkspaceRootPackageJSON = {
  name: (undefined as unknown) as string,
  author: (undefined as unknown) as string,
  version: '0.1.0',
  private: true,
  license: 'MIT',
  workspaces: [],
  scripts: {
    start: 'react-scripts start',
    build: 'react-scripts build',
    test: 'react-scripts test',
    eject: 'react-scripts eject',
    lint: 're-space lint',
    stylelint: 'stylelint "src/**/*.{css,sass,scss}"'
  },
  dependencies: {
    react: '16.13.1',
    'react-dom': '16.13.1',
    'react-scripts': '3.4.1'
  },
  devDependencies: {
    '@re-space/cli': 'latest',
    '@testing-library/dom': '6.12.2',
    '@testing-library/jest-dom': '4.2.4',
    '@testing-library/react': '9.4.0',
    '@testing-library/user-event': '7.2.1',
    '@types/node': '13.13.6',
    '@types/react': '16.9.35',
    '@types/react-dom': '16.9.8',
    '@types/react-router-dom': '5.1.5',
    '@typescript-eslint/eslint-plugin': '3.1.0',
    '@typescript-eslint/parser': '3.2.0',
    'eslint-config-prettier': '6.11.0',
    'eslint-config-react-app': '5.2.1',
    'eslint-plugin-prettier': '3.1.3',
    'eslint-plugin-promise': '4.2.1',
    'eslint-plugin-react': '7.20.0',
    'eslint-plugin-react-hooks': '4.0.4',
    'eslint-plugin-import': '2.21.2',
    'eslint-plugin-sonarjs': '0.5.0',
    'eslint-plugin-jsx-a11y': '6.2.3',
    husky: '4.2.5',
    'lint-staged': '10.2.9',
    prettier: '2.0.5',
    stylelint: '13.6.0',
    'stylelint-config-recommended': '3.0.0',
    tslib: '2.0.0',
    typescript: '3.9.5',
    yarn: '1.22.4'
  },
  browserslist: {
    production: ['>0.2%', 'not dead', 'not op_mini all'],
    development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
  },
  jest: {
    moduleNameMapper: {}
  }
};
