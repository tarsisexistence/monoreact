import execa from 'execa';
import { Sade } from 'sade';
import ora from 'ora';

import { logError } from '../../errors';
import { defineDependencyFlag } from '../../helpers/utils/dependency.utils';
import { InstallMessages } from '../../helpers/messages/install.messages';
import {
  findWorkspacePackagePath,
  findWorkspaceRootPath
} from '../../helpers/utils/package.utils';

export const installBinCommand = (prog: Sade) => {
  prog
    .command('install')
    .describe(
      'Install one or more dependencies to the workspace root. Run this script inside any package and re-space will add peer dependencies as well.'
    )
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('i')
    .example('install libraryName')
    .option('d, dev', 'Install development dependencies')
    .example(`install libraryName --dev`)
    .action(async ({ _: dependencies, dev, d }: CLI.Options.Install) => {
      const dependencyFlag = defineDependencyFlag(dev, d);
      const { installing, failed, successful } = new InstallMessages(
        dependencies
      );
      const installSpinner = ora(installing());

      if (typeof dev === 'string' || typeof d === 'string') {
        dependencies.push(dev as string);
      }

      try {
        installSpinner.start();
        const workspacePackage = await findWorkspacePackagePath();
        const workspaceRoot = await findWorkspaceRootPath();

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

        installSpinner.succeed(successful());
      } catch (e) {
        installSpinner.fail(failed());
        logError(e);
      }
    });
};
