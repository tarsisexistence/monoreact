import { Sade } from 'sade';
import execa from 'execa';

import { findWorkspaceRootDir } from '../../shared/utils';
import { finished } from './submodules.helpers';

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
    .option('s, self', 'Apply pull for the host workspace')
    .example('submodules pull --self')
    .action(
      async (
        branch = 'master',
        { self, remote }: CLI.Options.SubmodulesPull
      ) => {
        const workspaceRootPath = await findWorkspaceRootDir();
        const cmd = 'pull';
        const { exitCode: submodulesExitCode } = await execa(
          'git',
          ['submodule', 'foreach', 'git', cmd, remote, branch],
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
Entering 'core'`);
          const { exitCode: coreExitCode } = await execa(
            'git',
            [cmd, remote, branch],
            {
              stdio: [process.stdin, process.stdout, process.stderr],
              cwd: workspaceRootPath
            }
          );
          console.log(
            finished({
              cmd,
              code: coreExitCode,
              type: 'core'
            })
          );
        }
      }
    );
}
