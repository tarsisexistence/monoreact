import { Input, Select } from 'enquirer';
import fs from 'fs-extra';

import { getAuthorName, info } from '../../shared/utils';
import { generateSetup } from '../../setup/generate';
import { generateMessage } from '../../shared/messages/generate.messages';

export const getAuthor = async (): Promise<CLI.Package.Author> => {
  let author = getAuthorName();

  if (!author) {
    const licenseInput = new Input({
      name: 'author',
      message: 'Who is the package author?'
    });
    author = await licenseInput.run();
  }

  return author;
};

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

export const getSafePackageName = async (
  {
    workspaceRoot,
    packageSetupPath,
    packageName
  }: {
    workspaceRoot: string;
    packageSetupPath: string;
    packageName: string;
  },
  onFailedPath: (name: string) => void
): Promise<string> => {
  const isExist = await fs.pathExists(
    `${workspaceRoot}/${packageSetupPath}/${packageName}`
  );

  if (!isExist) {
    return packageName;
  }

  onFailedPath(packageName);

  const packageNamePrompt = new Input({
    message: generateMessage.exists(packageName),
    initial: generateMessage.copy(packageName),
    result: (v: string) => v.trim()
  });

  const newPackageName = await packageNamePrompt.run();

  return getSafePackageName(
    {
      packageName: newPackageName,
      workspaceRoot,
      packageSetupPath
    },
    onFailedPath
  );
};
