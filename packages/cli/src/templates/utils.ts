import { Template } from './template';
import { MainPackageJson } from '../types';

export const composePackageJson = (template: Template) => ({
  name,
  author
}: Pick<MainPackageJson, 'name' | 'author'>) => ({
  ...template.packageJson,
  name,
  author
});
