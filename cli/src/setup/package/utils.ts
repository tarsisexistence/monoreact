import { safePackageName } from '../../helpers/utils';

export const composePackageJson = (template: CLI.Template.PackageOptions) => ({
  author,
  name,
  rootName,
  license
}: Pick<CLI.Package.RootPackageJSON, 'name' | 'author' | 'license'> & {
  rootName: string;
}) => {
  const slashNameIndex = rootName.indexOf('/');
  const namespace =
    slashNameIndex === -1 ? `@${rootName}` : rootName.slice(0, slashNameIndex);
  const safeName = safePackageName(name);
  const packageName = namespace ? `${namespace}/${safeName}` : safeName;
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
