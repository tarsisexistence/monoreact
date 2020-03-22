import execa from 'execa';
import { Sade } from 'sade';
import ora from 'ora';

import { logError } from '../errors';
import {
  findWorkspacePackage,
  findWorkspaceRoot
} from '../helpers/utils/package.utils';
import { defineDependencyFlag } from '../helpers/utils/dependency.utils';
import { InstallMessages } from '../helpers/messages/install.messages';

export const installBinCommand = (prog: Sade) => {
  prog
    .command(
      'install',
      `Install one or more dependencies to the workspace root. Run this script inside any package and re-space will add peer dependencies as well.`,
      {
        // eslint-disable no-param-reassign

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        alias: ['i']
      }
    )
    .example('install libraryName')
    .option('--dev', 'Installs devDependencies')
    .example(`install libraryName --dev`)
    .option('-D', 'Installs devDependencies')
    .example(`install libraryName -D`)
    .action(async (opts: CLI.InstallOptions) => {
      const { _: dependencies, dev, D } = opts;
      const dependencyFlag = defineDependencyFlag(dev, D);
      const { installing, failed, success } = new InstallMessages(dependencies);
      const bootSpinner = ora(installing());

      if (typeof D === 'string') {
        dependencies.push(D);
      }

      if (typeof dev === 'string') {
        dependencies.push(dev);
      }

      try {
        bootSpinner.start();
        const workspacePackage = await findWorkspacePackage();
        const workspaceRoot = await findWorkspaceRoot();

        if (workspacePackage !== null) {
          await execa(`yarn add ${dependencies.join(' ')}`, ['--peer'], {
            cwd: workspacePackage
          });
        }

        if (workspaceRoot !== null) {
          await execa(
            `yarn add ${dependencies.join(' ')} ${dependencyFlag}`,
            ['--exact', '-W'],
            { cwd: workspaceRoot }
          );
        }

        bootSpinner.succeed(success());
      } catch (e) {
        bootSpinner.fail(failed());
        logError(e);
      }
    });
};
