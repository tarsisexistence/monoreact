import { Select } from 'enquirer';

import { info } from '../../shared/utils';
import { generateSetup } from './setup/generate';

export const safePackageName = (name: string) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');

export const chooseTemplatePrompt = new Select({
  message: 'Choose a template',
  choices: Object.keys(generateSetup).map(option => ({
    name: option,
    message: info(option)
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
