import { Sade } from 'sade';
import { spawn } from 'child_process';
import execa from 'execa';

import { finished, getWorkspaceRootPath } from './submodules.helpers';

export function submodulesPullBinCommand(prog: Sade): void {
  prog
    .command('submodules pull <remote> <branch>')
    .describe('Pull each submodule (origin/develop by default)')
    .example('submodules pull')
    .example('submodules pull origin master')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sp')
    .option('--self', 'Apply git pull for the workspace root repository.')
    .example('submodules pull --self')
    .action(
      async (
        remote: string,
        branch: string,
        { self }: CLI.Options.Submodules
      ) => {
        const workspaceRootPath = await getWorkspaceRootPath();

        const child = spawn(
          'git',
          ['submodule', 'foreach', 'git pull', remote, branch],
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
              cmd: 'pull',
              code,
              type: 'submodules'
            })
          );

          if (self) {
            console.log(`
Entering 'core'`);
            const { stderr, stdout, exitCode } = await execa(
              'git',
              ['pull', remote, branch],
              { cwd: workspaceRootPath }
            );
            console.log(stdout, stderr);
            console.log(
              finished({
                cmd: 'pull',
                code: exitCode,
                type: 'core'
              })
            );
          }
        });
      }
    );
}
