import packageJson from '../../../package.json';

export const PACKAGE_JSON = 'package.json';
export const TSCONFIG_JSON = 'tsconfig.json';

export const BASE_PACKAGE_SCRIPTS: CLI.Package.Scripts = {
  start: 'monoreact watch',
  build: 'monoreact build',
  test: 'monoreact test --passWithNoTests',
  lint: 'monoreact lint "src/**/*.{js,jsx,ts,tsx}"',
  prepublishOnly: 'yarn build'
} as const;

export const REACT_PACKAGE_SCRIPTS: CLI.Package.Scripts = {
  ...BASE_PACKAGE_SCRIPTS,
  stylelint: 'npx stylelint "src/**/*.{css,sass,scss}"'
} as const;

export const REACT_TEMPLATE_DEPENDENCIES: Pick<CLI.Package.PackagePackageJSON, 'peerDependencies'> = {
  peerDependencies: {
    react: '*'
  }
};

export const WORKSPACE_PACKAGE_JSON: Omit<CLI.Package.PackagePackageJSON, 'scripts'> = {
  name: undefined as unknown as string,
  author: undefined as unknown as string,
  workspace: true,
  private: false,
  version: '0.1.0',
  main: 'dist/bundle.cjs.js',
  module: 'dist/bundle.js',
  types: 'dist/publicApi.d.ts',
  source: 'src/publicApi.ts',
  publishConfig: {
    access: 'public'
  }
};

export const WORKSPACE_ROOT_PACKAGE_JSON: CLI.Package.HostPackageJSON = {
  name: undefined as unknown as string,
  author: undefined as unknown as string,
  version: '0.1.0',
  private: true,
  license: 'MIT',
  workspaces: [],
  scripts: {
    start: 'react-scripts start',
    build: 'react-scripts build',
    test: 'react-scripts test',
    eject: 'react-scripts eject',
    lint: 'monoreact lint',
    stylelint: 'stylelint "src/**/*.{css,sass,scss}"'
  },
  dependencies: {
    react: packageJson.dependencies.react,
    'react-dom': '17.0.1',
    'react-scripts': '4.0.1'
  },
  devDependencies: {
    monoreact: 'latest',
    '@testing-library/dom': '6.12.2',
    '@testing-library/jest-dom': '4.2.4',
    '@testing-library/react': '9.4.0',
    '@testing-library/user-event': '7.2.1',
    '@types/node': packageJson.devDependencies['@types/node'],
    '@types/react': packageJson.devDependencies['@types/react'],
    '@types/react-dom': '17.0.5',
    '@typescript-eslint/eslint-plugin': '4.24.0',
    '@typescript-eslint/parser': '4.24.0',
    'eslint-config-prettier': packageJson.dependencies['eslint-config-prettier'],
    'eslint-config-react-app': packageJson.dependencies['eslint-config-react-app'],
    'eslint-plugin-prettier': packageJson.dependencies['eslint-plugin-prettier'],
    'eslint-plugin-promise': '4.2.1',
    'eslint-plugin-react': packageJson.dependencies['eslint-plugin-react'],
    'eslint-plugin-react-hooks': packageJson.dependencies['eslint-plugin-react-hooks'],
    'eslint-plugin-import': packageJson.dependencies['eslint-plugin-import'],
    'eslint-plugin-sonarjs': '0.5.0',
    'eslint-plugin-jsx-a11y': packageJson.dependencies['eslint-plugin-jsx-a11y'],
    husky: '4.3.5',
    'lint-staged': '11.0.0',
    prettier: '2.3.0',
    stylelint: '14.1.0',
    'stylelint-config-recommended': '3.0.0',
    tslib: packageJson.dependencies.tslib,
    typescript: packageJson.dependencies.typescript,
    yarn: packageJson.devDependencies.yarn
  },
  browserslist: {
    production: ['>0.2%', 'not dead', 'not op_mini all'],
    development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
  }
};
