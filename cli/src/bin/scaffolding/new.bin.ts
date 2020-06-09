import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import { logError } from '../../shared/utils';
import {
  buildPackage,
  createPackageJson,
  copyTemplate,
  getAuthor,
  getSafeName,
  sortPackageJson,
  setAuthorName
} from './scaffolding.helpers';
import { generateMessage } from '../../shared/messages';
import { newSetup } from './setup/new';

export const newBinCommand = (prog: Sade): void => {
  prog
    .command('new <pkg> [dir]')
    .describe('Create new project')
    .alias('c')
    .example('create projectName')
    .action(async (name: string, dir?: string) => {
      // TODO: specify template option
      const template: CLI.Setup.NewOptionType = 'cra';
      const bootSpinner = ora('Start creating host React project');

      const projectName =
        dir !== undefined && process.cwd() === path.resolve(dir)
          ? name
          : await getSafeName({
              basePath: process.cwd(),
              name,
              onFail: (unsafeName: string) => {
                bootSpinner.fail(`Already exists ${unsafeName}`);
              }
            });
      const projectDir =
        dir !== undefined ? path.resolve(dir) : path.resolve(projectName);

      if (fs.existsSync(projectDir)) {
        bootSpinner.fail(`Already exists directory ${projectDir}`);
        process.exit(1);
      }

      try {
        bootSpinner.start(`Creating a new React app in ${projectDir}`);
        await copyTemplate({ dir: projectDir, bin: 'new', template });
        bootSpinner.stop();
        const author = await getAuthor();
        setAuthorName(author);
        bootSpinner.start();
        process.chdir(projectDir);
        const templateConfig = newSetup[template];
        const packageJsonPreset: CLI.Package.WorkspaceRootPackageJSON = {
          ...templateConfig.packageJson,
          name: projectName,
          author: author
        };
        await createPackageJson({ dir: projectDir, preset: packageJsonPreset });
        bootSpinner.succeed(generateMessage.successful(projectName));
      } catch (err) {
        bootSpinner.fail(generateMessage.failed(projectName));
        logError(err);
        process.exit(1);
      }

      const preparingSpinner = ora('Preparing').start();

      try {
        await sortPackageJson();
        await buildPackage();
        preparingSpinner.succeed(generateMessage.successfulConfigure());
        console.log(await generateMessage.preparedPackage(projectName));
      } catch (err) {
        preparingSpinner.fail(generateMessage.failedConfigure());
        logError(err);
        process.exit(1);
      }
    });
};
