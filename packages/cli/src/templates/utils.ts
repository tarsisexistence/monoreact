import { Template } from './template';

interface ProjectArgs {
  name: string;
  author: string;
}
export const composePackageJson = (template: Template) => ({
  name,
  author
}: ProjectArgs) => ({
  ...template.packageJson,
  name,
  author
});
