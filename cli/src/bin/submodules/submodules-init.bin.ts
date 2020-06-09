import { Sade } from 'sade';

import { findWorkspaceRootDir, space } from '../../shared/utils';
import { submodulesMessage } from '../../shared/messages';
import { gitSubmoduleInit } from './submodules-init.helpers';

export function submodulesInitBinCommand(prog: Sade): void {
  prog
    .command('submodules init')
    .describe('Initialize missed submodules')
    .example('submodules init')
    .alias('si')
    .action(async () => {
      const rootDir = await findWorkspaceRootDir();
      console.log(submodulesMessage.init());
      space();
      await gitSubmoduleInit(rootDir);
    });
}
