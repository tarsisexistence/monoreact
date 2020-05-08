declare namespace CLI.Options {
  interface BaseOptions {
    _: string[];
  }

  interface Generate extends BaseOptions {
    workspaces: string;
    template: CLI.Setup.GenerateOptionType;
    t: CLI.Setup.GenerateOptionType;
    feature: CLI.Setup.AddOptionType;
    f: CLI.Setup.AddOptionType;
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
