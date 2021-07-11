import { Sade } from 'sade';

import { findPackageDirectory } from '../../shared/utils';
import { watchPackages } from './watch.helpers';

export const watchBinCommand = (prog: Sade): void => {
  prog
    .command('watch')
    .describe('Rebuild a package on change.')
    .alias('w', 'start')
    .example('watch')
    .action(async () => {
      const packageDir = await findPackageDirectory();
      await watchPackages(packageDir);
    });
};
