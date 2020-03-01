import { PackageJson } from 'type-fest';

interface PackageTemplate {
  dependencies: string[];
  packageJson: PackageJson;
}

interface FeatureTemplate {
  path: string;
  scripts: { [scriptName: string]: string };
}
