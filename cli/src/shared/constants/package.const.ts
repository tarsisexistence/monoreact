import packageJson from '../../../package.json';

export const PACKAGE_JSON = 'package.json';
export const TSCONFIG_JSON = 'tsconfig.json';

export const BASE_PACKAGE_SCRIPTS: CLI.Package.Scripts = {
  // TODO: run npx under the hood if monoreact command not found
  start: 'npx monoreact watch',
  build: 'npx monoreact build',
  test: 'npx monoreact test --passWithNoTests',
  lint: 'npx monoreact lint "src/**/*.{js,jsx,ts,tsx}"',
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
    react: '^17.0.2',
    'react-dom': '^17.0.2',
    'react-scripts': '5.0.1'
  },
  devDependencies: {
    monoreact: 'latest',
    '@testing-library/jest-dom': '^5.16.1',
    '@testing-library/react': '^12.1.2',
    '@testing-library/user-event': '^13.5.0',
    'web-vitals': '^2.1.2',
    '@types/jest': '^27.0.3',
    '@types/react': '^17.0.45',
    '@types/react-dom': '^17.0.17',
    '@types/node': packageJson.devDependencies['@types/node'],
    '@typescript-eslint/eslint-plugin': '5.7.0',
    '@typescript-eslint/parser': '5.7.0',
    'eslint-config-prettier': packageJson.dependencies['eslint-config-prettier'],
    'eslint-config-react-app': packageJson.dependencies['eslint-config-react-app'],
    'eslint-plugin-compat': packageJson.dependencies['eslint-plugin-compat'],
    'eslint-plugin-prettier': packageJson.dependencies['eslint-plugin-prettier'],
    'eslint-plugin-promise': '5.2.0',
    'eslint-plugin-react': packageJson.dependencies['eslint-plugin-react'],
    'eslint-plugin-react-hooks': packageJson.dependencies['eslint-plugin-react-hooks'],
    'eslint-plugin-import': packageJson.dependencies['eslint-plugin-import'],
    'eslint-plugin-sonarjs': '0.11.0',
    'eslint-plugin-jsx-a11y': packageJson.dependencies['eslint-plugin-jsx-a11y'],
    husky: '4.3.8',
    'lint-staged': '12.5.0',
    prettier: '2.6.2',
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
