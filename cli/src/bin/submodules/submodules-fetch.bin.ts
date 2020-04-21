import { Sade } from 'sade';
import execa from 'execa';

import { findWorkspaceRootDir } from '../../shared/utils';

export function submodulesFetchBinCommand(prog: Sade): void {
  prog
    .command('submodules fetch')
    .describe('Fetch each submodule')
    .example('submodules fetch')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sf')
    .option('s, self', 'Apply git fetch for the workspace root repository')
    .example('submodules fetch --self')
    .action(async ({ self }: CLI.Options.Submodules) => {
      const workspaceRootPath = await findWorkspaceRootDir();
      const cmd = 'fetch';

      await execa('git', ['submodule', 'foreach', 'git', cmd, '--all'], {
        cwd: workspaceRootPath,
        stdio: [process.stdin, process.stdout, process.stderr]
      });

      console.log(`Finished 'submodules' ${cmd}`);

      if (self) {
        console.log(`
Entering 'core'`);
        await execa('git', [cmd, '--all'], {
          stdio: [process.stdin, process.stdout, process.stderr],
          cwd: workspaceRootPath
        });
        console.log(`Finished 'core' ${cmd}`);
      }
    });
}
