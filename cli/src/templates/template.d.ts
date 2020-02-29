import { PackageJson } from 'type-fest';

interface PackageTemplate {
  dependencies: string[];
  packageJson: PackageJson;
}
