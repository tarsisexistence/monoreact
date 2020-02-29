import { PackageTemplate } from './template';
import { RootPackageJson } from '../types';

export const composePackageJson = (template: PackageTemplate) => ({
  name,
  author
}: Pick<RootPackageJson, 'name' | 'author'>) => ({
  ...template.packageJson,
  name,
  author
});
