declare namespace YarnWorkspaces {
  type Workspaces = YarnWorkspaces.Packages | YarnWorkspaces.Config | undefined;

  type Packages = string[];

  interface Config {
    packages: Packages;
    nohoist?: Packages;
  }
}
