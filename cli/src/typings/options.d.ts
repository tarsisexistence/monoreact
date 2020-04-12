declare namespace CLI.Options {
  interface BaseOptions {
    _: string[];
  }

  interface Generate extends BaseOptions {
    workspaces: string;
    template: CLI.Template.Package;
    feature: CLI.Template.Feature;
  }

  interface Install extends BaseOptions {
    dev?: boolean | string;
    d?: boolean | string;
  }

  interface Submodules extends BaseOptions {
    self: boolean;
  }
}
