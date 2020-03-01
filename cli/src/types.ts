export type Author =
  | string
  | {
      name: string;
      email: string;
      url: string;
    };

interface BasePackageJson {
  name: string;
  version: string;
  private: boolean;
  license: string;
  author: Author;
  scripts: { [scriptName: string]: string };
}

export interface RootPackageJson extends BasePackageJson {
  workspaces: string[];
  dependencies?: { [packageName: string]: string };
  devDependencies?: { [packageName: string]: string };
}

export interface WorkspacePackageJson extends BasePackageJson {
  workspace: boolean;
  main: 'dist/bundle.cjs.js';
  module: 'dist/bundle.esm.js';
  'jsnext:main': 'dist/bundle.esm.js';
  types: 'dist/publicApi.d.ts';
  input: string;
  publishConfig: { access: 'public' };
  peerDependencies?: { [packageName: string]: string };
}
