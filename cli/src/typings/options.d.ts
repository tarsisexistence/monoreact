declare namespace CLI.Options {
  interface BaseOptions {
    _: string[];
  }

  interface Generate extends BaseOptions {
    workspaces: string;
    template: CLI.Setup.GenerateOptionType;
    feature: CLI.Setup.AddOptionType;
  }

  interface New extends BaseOptions {
    template: CLI.Setup.NewOptionType;
    force: boolean;
  }

  interface Install extends BaseOptions {
    dev: boolean | string;
  }

  interface Test extends BaseOptions {
    config: string;
  }

  interface Lint extends BaseOptions {
    fix: boolean;
    'ignore-path': string;
  }

  interface Submodules extends BaseOptions {
    self: boolean;
  }

  interface Workspaces extends BaseOptions {
    quiet: string | boolean;
    exclude: string;
    fix?: string | boolean;
  }

  interface SubmodulesPull extends Submodules {
    remote: string;
  }
}
