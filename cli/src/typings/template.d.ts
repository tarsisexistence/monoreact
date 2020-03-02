declare namespace CLI.Template {
  type package = 'basic' | 'react';
  type feature = 'docz' | 'playground';

  interface PackageOptions {
    dependencies: string[];
    packageJson: PackageJson;
  }

  interface FeatureOptions {
    path: string;
    scripts: { [scriptName: string]: string };
  }
}
