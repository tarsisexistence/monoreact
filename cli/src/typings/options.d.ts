declare namespace CLI.Options {
  interface BaseOptions {
    _: string[];
  }

  interface Generate extends BaseOptions {
    workspaces: string;
    template: CLI.Template.GenerateType;
    t: CLI.Template.GenerateType;
    feature: CLI.Template.AddType;
    f: CLI.Template.AddType;
  }

  interface Install extends BaseOptions {
    dev: boolean | string;
    D: boolean | string;
  }

  interface Test extends BaseOptions {
    config: string;
  }

  interface Lint extends BaseOptions {
    fix: boolean;
    'ignore-pattern': string;
  }

  interface Submodules extends BaseOptions {
    self: boolean;
    s: boolean;
  }

  interface SubmodulesPull extends Submodules {
    remote: string;
    r: string;
  }
}
