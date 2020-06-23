import execa from 'execa';
import { Sade } from 'sade';
import ora from 'ora';

import { installMessage } from '../../shared/messages';
import {
  findWorkspacePackageDir,
  findWorkspaceRootDir,
  logError
} from '../../shared/utils';

export const installBinCommand = (prog: Sade): void => {
  prog
    .command('install')
    .describe(
      'Install one or more dependencies to the workspace root. Run this script inside any package and re-space will add peer dependencies as well'
    )
    .alias('i')
    .example('install libraryName')
    .option('dev, D', 'Install development dependencies')
    .example(`install libraryName --dev`)
    .action(async ({ _: dependenciesList, dev }: CLI.Options.Install) => {
      const dependencies = dependenciesList.join(' ');
      const installSpinner = ora(installMessage.installing(dependencies));
      installSpinner.start();

      try {
        const workspacePackage = await findWorkspacePackageDir(true);
        const installPackageArgs = ['add'];

        if (dev) {
          installPackageArgs.push('--dev');
        } else {
          installPackageArgs.push('--peer');
        }

        for (const dependency of dependenciesList) {
          installPackageArgs.push(dependency);
        }
        await execa('yarn', installPackageArgs, { cwd: workspacePackage });

        /** it is ok if findWorkspacePackageDir will throw an error
         * it just means that we are not in the package dir
         **/
        // eslint-disable-next-line no-empty
      } catch {}

      try {
        const workspaceRoot = await findWorkspaceRootDir(true);
        const installRootArgs = ['add', '--exact', '-W'];

        if (dev) {
          installRootArgs.push('--dev');
        }

        if (typeof dev === 'string') {
          dependenciesList.push(dev as string);
        }

        for (const dependency of dependenciesList) {
          installRootArgs.push(dependency);
        }

        await execa('yarn', installRootArgs, { cwd: workspaceRoot });
        installSpinner.succeed(installMessage.successful(dependencies));
      } catch (err) {
        installSpinner.fail(installMessage.failed(dependencies));
        logError(err);
        process.exit(1);
      }
    });
};
