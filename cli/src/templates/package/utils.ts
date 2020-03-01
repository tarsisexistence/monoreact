import { PackageTemplate } from '../template';
import { RootPackageJson } from '../../types';
import { safePackageName } from '../../utils';

export const composePackageJson = (template: PackageTemplate) => ({
  author,
  name,
  rootName,
  license
}: Pick<RootPackageJson, 'name' | 'author' | 'license'> & {
  rootName: string;
}) => {
  const slashNameIndex = rootName.indexOf('/');
  const scope =
    slashNameIndex === -1 ? `@${rootName}` : rootName.slice(0, slashNameIndex);
  const safeName = safePackageName(name);
  const packageName = scope ? `${scope}/${safeName}` : safeName;
  const packageJson = {
    ...template.packageJson,
    name: packageName,
    author
  };

  if (license) {
    packageJson.license = license;
  }

  return packageJson;
};
