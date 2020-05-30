import path from 'path';
import fs from 'fs-extra';
import { exec } from 'shelljs';
import { Input, Select } from 'enquirer';

import { info } from '../../shared/utils';
import { generateSetup } from './setup/generate';
import { generateMessage } from '../../shared/messages';
import { PACKAGE_JSON } from '../../shared/constants/package.const';

export const safePackageName = (name: string) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');

export function getAuthorName(): CLI.Package.Author {
  let author = '';

  author = exec('npm config get init-author-name', {
    silent: true
  }).stdout.trim();

  if (author) {
    return author;
  }

  author = exec('git config user.name', { silent: true }).stdout.trim();
  if (author) {
    setAuthorName(author);
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

export const copyPackageTemplate = ({
  dir,
  template
}: {
  dir: string;
  template: string;
}): Promise<void> =>
  fs.copy(
    path.resolve(__dirname, `../../../../templates/generate/${template}`),
    dir,
    {
      overwrite: true
    }
  );

export const createPackageJson = ({
  dir,
  preset
}: {
  dir: string;
  preset: CLI.Package.WorkspacePackageJSON;
}): Promise<void> =>
  fs.outputJSON(path.resolve(dir, PACKAGE_JSON), preset, {
    spaces: 2
  });

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

export const buildPackage = () => exec('yarn build', { silent: true });

export const sortPackageJson = () =>
  exec('npx sort-package-json', { silent: true });

export function setAuthorName(author: CLI.Package.Author): void {
  exec(`npm config set init-author-name "${author}"`, { silent: true });
}
