declare namespace CLI.Package {
  type Author =
    | string
    | {
        name: string;
        email: string;
        url: string;
      };

  interface BasePackageJSON {
    name: string;
    version: string;
    private: boolean;
    license: string;
    author: Author;
    scripts: { [scriptName: string]: string };
  }

  interface WorkspaceRootPackageJSON extends BasePackageJSON {
    workspaces: string[];
    dependencies?: { [packageName: string]: string };
    devDependencies?: { [packageName: string]: string };
  }

  interface WorkspacePackageJSON extends BasePackageJSON {
    workspace: boolean;
    module: 'dist/bundle.esm.js';
    'jsnext:main': 'dist/bundle.esm.js';
    types: 'dist/publicApi.d.ts';
    input: string;
    publishConfig: { access: 'public' };
    peerDependencies?: { [packageName: string]: string };
  }
}
