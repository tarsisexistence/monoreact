declare namespace CLI.Package {
  interface PackageInfo {
    name: string;
    location: string;
  }

  interface BasePackageJSON {
    name: string;
    version: string;
    private: boolean;
    author: Author;
    scripts: { [script: string]: string };
    license?: string;
    eslintConfig?: Record<string, string | string[]>;
    dependencies?: Dependencies;
    devDependencies?: Dependencies;
  }

  interface HostPackageJSON extends BasePackageJSON {
    workspaces: YarnWorkspaces.Workspaces;
    browserslist: {
      production: string[];
      development: string[];
    };
    jest: Record<string, any>;
  }

  interface PackagePackageJSON extends BasePackageJSON {
    workspace: true;
    module: 'dist/bundle.js';
    types: 'dist/publicApi.d.ts';
    source: string;
    publishConfig: { access: 'public' };
    peerDependencies?: Dependencies;
  }

  type AnyPackageJson = CLI.Package.BasePackageJSON & CLI.Package.HostPackageJSON & CLI.Package.PackagePackageJSON;

  type Author =
    | string
    | {
        name: string;
        email: string;
        url: string;
      };

  type Dependencies = { [name: string]: string } | Record<string, unknown>;
  type Scripts = { [script: string]: string };
}
