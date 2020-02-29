import { PackageJson } from 'type-fest';

interface PackageTemplate {
  dependencies: string[];
  name: string;
  packageJson: PackageJson;
}
