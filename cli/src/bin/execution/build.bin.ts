import { Sade } from 'sade';

import { findPackageDirectory } from '../../shared/utils';
import { buildPackages } from './build.helpers';

export const buildBinCommand = (prog: Sade): void => {
  prog
    .command('build')
    .describe('Build a package.')
    .alias('b')
    .example('build')
    .action(async (): Promise<void> => {
      const packageDir = await findPackageDirectory();
      await buildPackages(packageDir);
    });
};
