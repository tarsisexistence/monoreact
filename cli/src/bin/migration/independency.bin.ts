import { Sade } from 'sade';
import ora from 'ora';

import { findPackageDirectory, installDependencies, logError } from '../../shared/utils';
import { independencyMessage } from '../../shared/messages';
import {
  copyIndependencyTemplate,
  makePackageJsonIndependent,
  makeTsconfigJsonIndependent
} from './independency.helpers';

export const independencyBinCommand = (prog: Sade): void => {
  prog
    .command('migration independency')
    .describe('Add all necessary settings to the package so that it can function outside of the workspace')
    .alias('mi')
    .example('migration independency')
    .action(async () => {
      const bootSpinner = ora(independencyMessage.generating());
      const packageDir = await findPackageDirectory();
      bootSpinner.start();

      try {
        await makeTsconfigJsonIndependent(packageDir);
        await makePackageJsonIndependent(packageDir);
        await copyIndependencyTemplate(packageDir);
        await installDependencies();
        bootSpinner.succeed(independencyMessage.successful());
      } catch (err) {
        bootSpinner.fail(independencyMessage.failed());

        logError(err);
        process.exit(1);
      }
    });
};
