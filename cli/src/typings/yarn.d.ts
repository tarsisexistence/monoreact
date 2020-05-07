declare namespace YarnWorkspaces {
  type Packages = string[];

  interface Config {
    packages: Packages;
    nohoist?: Packages;
  }
}
