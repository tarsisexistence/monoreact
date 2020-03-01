import { PackageJson } from 'type-fest';

interface PackageTemplate {
  dependencies: string[];
  packageJson: PackageJson;
}

interface FeatureTemplate {
  scripts: { [scriptName: string]: string };
}
