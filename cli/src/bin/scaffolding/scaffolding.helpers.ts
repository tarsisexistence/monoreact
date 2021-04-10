import fs from 'fs-extra';
import path from 'path';
import { exec, ShellString } from 'shelljs';
import { Input } from 'enquirer';

import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { getNpmAuthorName } from '../../shared/utils';

export const sortPackageJson = (): ShellString => exec('npx sort-package-json', { silent: true });

export const createPackageJson = ({
  dir,
  preset
}: {
  dir: string;
  preset: CLI.Package.PackagePackageJSON | CLI.Package.HostPackageJSON;
}): Promise<void> => fs.outputJSON(path.resolve(dir, PACKAGE_JSON), preset, { spaces: 2 });

export const getAuthor = async (): Promise<CLI.Package.Author> => {
  const author = getNpmAuthorName();

  if (author !== null) {
    return author;
  }

  const licenseInput = new Input({
    name: 'author',
    message: 'Who is the package author?'
  });
  return licenseInput.run();
};

export const copyTemplate = ({
  dir,
  bin,
  template
}: {
  dir: string;
  template: CLI.Setup.GenerateOptionType | CLI.Setup.NewOptionType;
  bin: 'generate' | 'new';
}): Promise<void> =>
  fs.copy(path.resolve(__dirname, `../../../../templates/${bin}/${template}`), dir, { overwrite: false });

export const preventFolderCollisions = async ({
  basePath,
  name,
  onPromptMessage,
  onPromptInitial
}: {
  basePath: string;
  name: string;
  onPromptMessage: (name: string) => string;
  onPromptInitial: (name: string) => string;
}): Promise<string> => {
  const isExist = fs.existsSync(path.resolve(basePath, name));

  if (!isExist) {
    return name;
  }

  const namePrompt = new Input({
    message: onPromptMessage(name),
    initial: onPromptInitial(name),
    result: (v: string) => v.trim()
  });
  const newProjectName = await namePrompt.run();

  return preventFolderCollisions({
    basePath,
    name: newProjectName,
    onPromptMessage,
    onPromptInitial
  });
};
