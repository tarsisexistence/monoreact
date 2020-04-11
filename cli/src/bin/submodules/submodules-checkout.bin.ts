import { Sade } from 'sade';
import { spawn } from 'child_process';
import execa from 'execa';

import { finished, getWorkspaceRootPath } from './submodules.helpers';

export function submodulesCheckoutBinCommand(prog: Sade): void {
  prog
    .command('submodules checkout <branch>')
    .describe('Checkout each submodule on the specific branch')
    .example('submodules checkout branch-name')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sc')
    .option('--self', 'Apply git checkout for the workspace root repository.')
    .example('submodules checkout branch-name --self')
    .action(async (branch: string, { self }: CLI.Options.Submodules) => {
      const workspaceRootPath = await getWorkspaceRootPath();
      const child = spawn(
        'git',
        ['submodule', 'foreach', 'git checkout', '-B', branch],
        { cwd: workspaceRootPath }
      );

      child.stdout.on('data', data => {
        process.stdout.write(data.toString());
      });

      child.stderr.on('data', data => {
        process.stdout.write(data.toString());
      });

      child.on('close', async code => {
        console.log(
          finished({
            cmd: 'checkout',
            code,
            type: 'submodules'
          })
        );

        if (self) {
          console.log(`
Entering 'core'`);
          const { stderr, stdout, exitCode } = await execa(
            'git',
            ['checkout', '-B', branch],
            { cwd: workspaceRootPath }
          );
          console.log(stdout, stderr);
          console.log(
            finished({
              cmd: 'checkout',
              code: exitCode,
              type: 'core'
            })
          );
        }
      });
    });
}
