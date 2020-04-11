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

  interface SubmodulesOptions {
    _: string[];
    self: boolean;
  }

  type SubmodulesCommand = 'init' | 'fetch' | 'pull' | 'build' | 'checkout';
}
