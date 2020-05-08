declare namespace CLI.Setup {
  type GenerateOptionType = 'basic' | 'react';
  type AddOptionType = 'docz' | 'playground';
  type MigrationOptionType = 'independency';

  interface GenerateOptions {
    dependencies: string[];
    packageJson: CLI.Package.WorkspacePackageJSON;
  }

  interface AddOptions {
    path: string;
    scripts: { [scriptName: string]: string };
  }

  interface MigrationOptions {
    devDependencies: CLI.Package.Dependencies;
  }
}
