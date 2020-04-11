import { Sade } from 'sade';
import { spawn } from 'child_process';
import execa from 'execa';

import { finished, getWorkspaceRootPath } from './submodules.helpers';

export function submodulesFetchBinCommand(prog: Sade): void {
  prog
    .command('submodules fetch')
    .describe('Fetch each submodule')
    .example('submodules fetch')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sf')
    .option('--self', 'Apply git fetch for the workspace root repository.')
    .example('submodules fetch --self')
    .action(async ({ self }: CLI.Options.Submodules) => {
      const workspaceRootPath = await getWorkspaceRootPath();
      const child = spawn('git', ['submodule', 'foreach', 'git fetch --all'], {
        cwd: workspaceRootPath
      });

      child.stdout.on('data', data => {
        process.stdout.write(data.toString());
      });

      child.stderr.on('data', data => {
        process.stdout.write(data.toString());
      });

      child.on('close', async code => {
        console.log(
          finished({
            cmd: 'fetch',
            code,
            type: 'submodules'
          })
        );

        if (self) {
          console.log(`
Entering 'core'`);
          const { stderr, stdout, exitCode } = await execa(
            'git',
            ['fetch', '--all'],
            { cwd: workspaceRootPath }
          );
          console.log(stdout, stderr);
          console.log(
            finished({
              cmd: 'fetch',
              code: exitCode,
              type: 'core'
            })
          );
        }
      });
    });
}
