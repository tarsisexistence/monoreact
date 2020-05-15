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
  stylelint: 'stylelint "src/**/*.{css,sass,scss}"'
} as const;

export const REACT_TEMPLATE_DEPENDENCIES: Pick<
  CLI.Package.WorkspacePackageJSON,
  'peerDependencies'
> = {
  peerDependencies: {
    react: '*',
    'react-dom': '*'
  }
};

export const WORKSPACE_PACKAGE_JSON: Omit<
  CLI.Package.WorkspacePackageJSON,
  'scripts'
> = {
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
