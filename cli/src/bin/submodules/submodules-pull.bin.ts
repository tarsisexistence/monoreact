import { Sade } from 'sade';
import execa from 'execa';

import { getWorkspaceRootPath } from './submodules.helpers';

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
        const cmd = 'pull';
        await execa(
          'git',
          ['submodule', 'foreach', 'git', cmd, remote, branch],
          {
            stdio: [process.stdin, process.stdout, process.stderr],
            cwd: workspaceRootPath
          }
        );
        console.log(`Finished 'submodules' ${cmd}`);

        if (self) {
          console.log(`
Entering 'core'`);
          await execa('git', [cmd, remote, branch], {
            stdio: [process.stdin, process.stdout, process.stderr],
            cwd: workspaceRootPath
          });
          console.log(`Finished 'core' ${cmd}`);
        }
      }
    );
}
