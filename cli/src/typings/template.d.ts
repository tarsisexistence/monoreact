declare namespace CLI.Template {
  type GenerateType = 'basic' | 'react';
  type AddType = 'docz' | 'playground';

  interface GenerateOptions {
    dependencies: string[];
    packageJson: CLI.Package.WorkspacePackageJSON;
  }

  interface AddOptions {
    path: string;
    scripts: { [scriptName: string]: string };
  }
}
