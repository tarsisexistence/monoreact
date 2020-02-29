export type Author =
  | string
  | {
      name: string;
      email: string;
      url: string;
    };

export interface RootPackageJson {
  name: string;
  version: string;
  private: boolean;
  license: string;
  author: Author;
  workspaces: string[];
  scripts: { [scriptName: string]: string };
  dependencies?: { [packageName: string]: string };
  devDependencies?: { [packageName: string]: string };
}
