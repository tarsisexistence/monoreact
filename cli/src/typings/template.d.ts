declare namespace CLI.Template {
  type Package = 'basic' | 'react';
  type Feature = 'docz' | 'playground';

  interface GenerateOptions {
    dependencies: string[];
    packageJson: CLI.Package.WorkspacePackageJSON;
  }

  interface AddOptions {
    path: string;
    scripts: { [scriptName: string]: string };
  }
}
