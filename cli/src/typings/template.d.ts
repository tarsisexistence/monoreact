declare namespace CLI.Setup {
  type GenerateType = 'basic' | 'react';
  type AddType = 'docz' | 'playground';
  type MigrationType = 'independency';

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
