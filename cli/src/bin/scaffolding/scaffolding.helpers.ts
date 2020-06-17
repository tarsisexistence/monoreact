import { exec } from 'shelljs';
import fs from 'fs-extra';
import path from 'path';
import { Input } from 'enquirer';

import { PACKAGE_JSON } from '../../shared/constants/package.const';

export const sortPackageJson = () =>
  exec('npx sort-package-json', { silent: true });

export function setNpmAuthorName(author: CLI.Package.Author): void {
  exec(`npm config set init-author-name "${author}"`, { silent: true });
}

export const createPackageJson = ({
  dir,
  preset
}: {
  dir: string;
  preset:
    | CLI.Package.WorkspacePackageJSON
    | CLI.Package.WorkspaceRootPackageJSON;
}): Promise<void> =>
  fs.outputJSON(path.resolve(dir, PACKAGE_JSON), preset, {
    spaces: 2
  });

function getNpmAuthorName(): CLI.Package.Author {
  let author = '';

  author = exec('npm config get init-author-name', {
    silent: true
  }).stdout.trim();

  if (author) {
    return author;
  }

  author = exec('git config user.name', { silent: true }).stdout.trim();
  if (author) {
    setNpmAuthorName(author);
    return author;
  }

  author = exec('npm config get init-author-email', {
    silent: true
  }).stdout.trim();
  if (author) {
    return author;
  }

  author = exec('git config user.email', { silent: true }).stdout.trim();
  if (author) {
    return author;
  }

  return author;
}

export const getAuthor = async (): Promise<CLI.Package.Author> => {
  const author = getNpmAuthorName();

  if (author) {
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
  fs.copy(
    path.resolve(__dirname, `../../../../templates/${bin}/${template}`),
    dir,
    {
      overwrite: false
    }
  );

export const getSafeName = async ({
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

  return getSafeName({
    basePath,
    name: newProjectName,
    onPromptMessage,
    onPromptInitial
  });
};
