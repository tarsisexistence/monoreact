declare namespace CLI {
  interface GenerateOptions {
    workspaces: string;
    template: CLI.Template.Package;
    feature: CLI.Template.Feature;
  }

  interface InstallOptions {
    _: string[];
    dev?: boolean | string;
    D?: boolean | string;
  }
}
