declare namespace CLI {
  interface GenerateOptions {
    workspaces: string;
    template: CLI.Template.Package;
    feature: CLI.Template.Feature;
  }

  interface InstallOptions {
    _: string[];
    dev?: boolean | string;
    d?: boolean | string;
  }

  interface BuildOptions {
    _: string[];
    watch?: boolean | string;
    w?: boolean | string;
  }
}
