declare namespace CLI.Setup {
  type AddOptionType = 'docz' | 'playground';
  type GenerateOptionType = 'basic' | 'react';
  type NewOptionType = 'cra';
  type MigrationOptionType = 'independency';

  interface AddOptions {
    path: string;
    scripts: { [scriptName: string]: string };
  }

  interface GenerateOptions {
    dependencies: string[];
    packageJson: CLI.Package.WorkspacePackageJSON;
  }

  interface NewOptions {
    packageJson: CLI.Package.WorkspaceRootPackageJSON;
  }

  interface MigrationOptions {
    dependencies: CLI.Package.Dependencies;
    devDependencies: CLI.Package.Dependencies;
  }
}
