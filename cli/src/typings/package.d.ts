declare namespace CLI.Package {
  interface BasePackageJSON {
    name: string;
    version: string;
    private: boolean;
    author: Author;
    scripts: { [script: string]: string };
    license?: string;
    eslintConfig?: Record<string, string | string[]>;
  }

  interface WorkspaceRootPackageJSON extends BasePackageJSON {
    workspaces: string[];
    dependencies?: Dependencies;
    devDependencies?: Dependencies;
  }

  interface WorkspacePackageJSON extends BasePackageJSON {
    workspace: true;
    module: 'dist/bundle.esm.js';
    'jsnext:main': 'dist/bundle.esm.js';
    types: 'dist/publicApi.d.ts';
    source: string;
    publishConfig: { access: 'public' };
    peerDependencies?: Dependencies;
  }

  type Author =
    | string
    | {
        name: string;
        email: string;
        url: string;
      };

  type Dependencies = { [name: string]: string };
  type Scripts = { [script: string]: string };
}
