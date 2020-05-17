import { safePackageName } from '../../shared/utils';

export const composePackageJson = ({
  author,
  name,
  hostName,
  license,
  template
}: Pick<CLI.Package.WorkspaceRootPackageJSON, 'name' | 'author' | 'license'> & {
  hostName: string;
  template: CLI.Setup.GenerateOptions;
}): CLI.Package.WorkspacePackageJSON => {
  const slashNameIndex = hostName.indexOf('/');
  const namespace =
    slashNameIndex === -1 ? `@${hostName}` : hostName.slice(0, slashNameIndex);
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
