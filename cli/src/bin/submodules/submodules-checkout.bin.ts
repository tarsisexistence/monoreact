import { Sade } from 'sade';
import execa from 'execa';

import { findWorkspaceRootDir } from '../../shared/utils';
import { finished } from './submodules.helpers';

export function submodulesCheckoutBinCommand(prog: Sade): void {
  prog
    .command('submodules checkout <branch>')
    .describe('Checkout each submodule on the specific branch')
    .example('submodules checkout branch-name')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sc')
    .option('s, self', 'Apply checkout for the host workspace')
    .example('submodules checkout branch-name --self')
    .action(async (branch: string, { self }: CLI.Options.Submodules) => {
      const workspaceRootPath = await findWorkspaceRootDir();
      const cmd = 'checkout';
      const { exitCode: submodulesExitCode } = await execa(
        'git',
        ['submodule', 'foreach', 'git checkout', '-B', branch],
        {
          stdio: [process.stdin, process.stdout, process.stderr],
          cwd: workspaceRootPath
        }
      );

      console.log(
        finished({
          cmd,
          code: submodulesExitCode,
          type: 'submodules'
        })
      );

      if (self) {
        console.log(`
Entering 'host'`);
        const { exitCode: hostExitCode } = await execa(
          'git',
          ['checkout', '-B', branch],
          {
            stdio: [process.stdin, process.stdout, process.stderr],
            cwd: workspaceRootPath
          }
        );
        console.log(
          finished({
            cmd,
            code: hostExitCode,
            type: 'host'
          })
        );
      }
    });
}
