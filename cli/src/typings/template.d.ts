declare namespace CLI.Template {
  type Package = 'basic' | 'react';
  type Feature = 'docz' | 'playground';

  interface PackageOptions {
    dependencies: string[];
    packageJson: PackageJson;
  }

  interface FeatureOptions {
    path: string;
    scripts: { [scriptName: string]: string };
  }
}
