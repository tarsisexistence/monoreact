import { outputJSON } from 'fs-extra';
import { Select } from 'enquirer';

import {
  color,
  includePackageIntoWorkspaces,
  updateYarnWorkspacesDeclaration
} from '../../shared/utils';
import { generateSetup } from './setup/generate';
import { exec, ShellString } from 'shelljs';

export const safePackageName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');

export const chooseTemplatePrompt = new Select({
  message: 'Choose a template',
  choices: Object.keys(generateSetup).map(option => ({
    name: option,
    message: color.info(option)
  }))
});

export const getPackageTemplateType = async (
  template: CLI.Setup.GenerateOptionType | undefined,
  onInvalidTemplate: CLI.Common.EmptyFn
): Promise<CLI.Setup.GenerateOptionType> => {
  if (template !== undefined && generateSetup[template] === undefined) {
    onInvalidTemplate();
  }

  if (template === undefined || generateSetup[template] === undefined) {
    return chooseTemplatePrompt.run();
  }

  return template;
};

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

export const buildPackage = (): ShellString =>
  exec('yarn build', { silent: true });

export const updatePackageJsonWorkspacesDeclaration = async ({
  packageJson,
  packageJsonPath,
  packages,
  setupPath,
  packageName
}: {
  packageJson: CLI.Package.WorkspaceRootPackageJSON;
  packageJsonPath: string;
  packages: string[];
  setupPath: string;
  packageName: string;
}): Promise<void> => {
  const updatedWorkspaces = includePackageIntoWorkspaces({
    packages,
    setupPath,
    packageName
  });
  packageJson.workspaces = updateYarnWorkspacesDeclaration(
    packageJson.workspaces,
    updatedWorkspaces
  );
  await outputJSON(packageJsonPath, packageJson, { spaces: 2 });
};
