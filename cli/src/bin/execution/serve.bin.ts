import { Sade } from 'sade';

import { findPackageDirectory } from '../../shared/utils';
import { servePackages } from './serve.helpers';

export const serveBinCommand = (prog: Sade): void => {
  prog
    .command('serve')
    .describe('Rebuild a package on change (watch).')
    .alias('s', 'start', 'w', 'watch')
    .example('serve')
    .action(async () => {
      const packageDir = await findPackageDirectory();
      await servePackages(packageDir);
    });
};
