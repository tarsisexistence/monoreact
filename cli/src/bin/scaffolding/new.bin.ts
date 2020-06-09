import { Sade } from 'sade';
import ora from 'ora';
import fs from 'fs-extra';

import { installDependencies, logError } from '../../shared/utils';
import {
  createPackageJson,
  copyTemplate,
  getAuthor,
  sortPackageJson,
  setAuthorName
} from './scaffolding.helpers';
import { newSetup } from './setup/new';
import { newMessage } from '../../shared/messages';
import { getProjectDir, getProjectName } from './new.helpers';

export const newBinCommand = (prog: Sade): void => {
  prog
    .command('new <pkg> [dir]')
    .describe('Create new project')
    .alias('c')
    .example('create projectName')
    .action(async (name: string, dir?: string) => {
      // TODO: specify template option
      const template: CLI.Setup.NewOptionType = 'cra';
      const bootSpinner = ora();

      const projectName = await getProjectName({
        dir,
        name,
        onFailure: async (message: string) => {
          bootSpinner.fail(message);
        }
      });
      const projectDir = getProjectDir({
        dir,
        name: projectName
      });

      bootSpinner.start(newMessage.creating(projectDir));

      try {
        if (fs.existsSync(projectDir)) {
          bootSpinner.fail(newMessage.exists(projectDir));
          throw new Error(newMessage.exists(projectDir));
        }

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
        bootSpinner.succeed(
          newMessage.created({
            dir: projectDir,
            name: projectName
          })
        );
      } catch (err) {
        bootSpinner.fail(newMessage.failed(projectName));
        logError(err);
        process.exit(1);
      }

      const preparingSpinner = ora(newMessage.preparing()).start();

      try {
        sortPackageJson();
        installDependencies();
        preparingSpinner.succeed(newMessage.prepared());
      } catch (err) {
        preparingSpinner.fail(newMessage.failedPreparation());
        logError(err);
      }

      console.log(newMessage.finish(projectDir));
    });
};
