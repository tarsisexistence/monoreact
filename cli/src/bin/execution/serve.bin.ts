import { Sade } from 'sade';

import { findWorkspacePackageDir } from '../../shared/utils';
import { serveWorkspace } from './serve.helpers';

export const serveBinCommand = (prog: Sade): void => {
  prog
    .command('serve')
    .describe('Rebuild a package on change')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('s', 'start', 'w', 'watch')
    .example('serve')
    .action(async () => {
      const packageDir = await findWorkspacePackageDir();
      await serveWorkspace(packageDir);
    });
};
