import { Sade } from 'sade';
import ora from 'ora';

import { findPackageDirectory, installDependencies, logError } from '../../shared/utils';
import { detachMessage } from '../../shared/messages';
import { copyDetachTemplate, detachPackageJsonFromWorkspace, detachTsconfigJsonFromWorkspace } from './detach.helpers';

export const detachBinCommand = (prog: Sade): void => {
  prog
    .command('migration detach')
    .describe('Add all necessary settings to separate the package from the workspace.')
    .alias('mi')
    .example('migration detach')
    .action(async () => {
      const bootSpinner = ora(detachMessage.generating());
      const packageDir = await findPackageDirectory();
      bootSpinner.start();

      try {
        await detachTsconfigJsonFromWorkspace(packageDir);
        await detachPackageJsonFromWorkspace(packageDir);
        await copyDetachTemplate(packageDir);
        await installDependencies();
        bootSpinner.succeed(detachMessage.successful());
      } catch (err) {
        bootSpinner.fail(detachMessage.failed());

        logError(err);
        process.exit(1);
      }
    });
};
