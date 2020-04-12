import execa from 'execa';
import { Sade } from 'sade';

import { findWorkspaceRootPath } from '../../helpers/utils/package.utils';

export function submodulesInitBinCommand(prog: Sade): void {
  prog
    .command('submodules init')
    .describe('Initialize missed submodules')
    .example('submodules init')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('si')
    .action(async () => {
      const workspaceRootPath = await findWorkspaceRootPath();
      const cmd = 'init';
      await execa('git', ['submodule', 'update', '--remote', '--init'], {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: workspaceRootPath
      });

      console.log(`Finished 'submodules' ${cmd}`);
    });
}
