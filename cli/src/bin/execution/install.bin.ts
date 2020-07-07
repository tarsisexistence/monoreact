import execa from 'execa';
import { Sade } from 'sade';
import ora from 'ora';

import { installMessage } from '../../shared/messages';
import { findPackageDirectory, findHostDirectory, logError } from '../../shared/utils';

export const installBinCommand = (prog: Sade): void => {
  prog
    .command('install')
    .describe(
      `Install one or more dependencies to the workspace (host). 
      If you run this command inside some package, then it will be added to the package (as dev or peer dependency)`
    )
    .alias('i')
    .example('install libraryName')
    .option('dev, D', 'Install development dependencies')
    .example(`install libraryName --dev`)
    .action(async ({ _: dependenciesList, dev }: CLI.Options.Install) => {
      // TODO: add possibility to add args to others packages
      // TODO: add option all,include,exclude
      const dependencies = dependenciesList.join(' ');
      const installSpinner = ora(installMessage.installing(dependencies));
      installSpinner.start();

      try {
        const packageDir = await findPackageDirectory(true);
        const installPackageArgs = ['add'];

        if (dev) {
          installPackageArgs.push('--dev');
        } else {
          installPackageArgs.push('--peer');
        }

        for (const dependency of dependenciesList) {
          installPackageArgs.push(dependency);
        }
        await execa('yarn', installPackageArgs, { cwd: packageDir });

        /** it is ok if findPackageDir will throw an error
         * it just means that we are not in the package dir
         **/
        // eslint-disable-next-line no-empty
      } catch {}

      try {
        const rootDir = await findHostDirectory(true);
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

        await execa('yarn', installRootArgs, { cwd: rootDir });
        installSpinner.succeed(installMessage.successful(dependencies));
      } catch (err) {
        installSpinner.fail(installMessage.failed(dependencies));
        logError(err);
        process.exit(1);
      }
    });
};
