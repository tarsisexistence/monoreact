import { Sade } from 'sade';
import execa from 'execa';

import { findWorkspaceRootDir } from '../../helpers/utils/package.utils';

export function submodulesPullBinCommand(prog: Sade): void {
  prog
    .command('submodules pull [branch]')
    .describe('Pull each submodule (default master)')
    .example('submodules pull')
    .example('submodules pull develop')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sp')
    .option('r, remote', 'Define git remote', 'origin')
    .example('submodules pull master --remote fork')
    .option('s, self', 'Apply git pull for the workspace root repository')
    .example('submodules pull --self')
    .action(
      async (
        branch = 'develop',
        { self, remote }: CLI.Options.SubmodulesPull
      ) => {
        const workspaceRootPath = await findWorkspaceRootDir();
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
