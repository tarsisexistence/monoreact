import { Sade } from 'sade';

import { findWorkspacePackageDir } from '../../shared/utils';
import { buildWorkspace } from './build.helpers';

export const buildBinCommand = (prog: Sade): void => {
  prog
    .command('build')
    .describe('Build a package')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('b')
    .example('build')
    .action(
      async (): Promise<void> => {
        const packageDir = await findWorkspacePackageDir();
        await buildWorkspace(packageDir);
      }
    );
};
