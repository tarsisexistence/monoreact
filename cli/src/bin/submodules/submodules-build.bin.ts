import { Sade } from 'sade';
import execa from 'execa';

import { findWorkspaceRootDir } from '../../shared/utils';
import { finished } from './submodules.helpers';

export function submodulesBuildBinCommand(prog: Sade): void {
  prog
    .command('submodules build')
    .describe('Build each submodule')
    .example('submodules build')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sb')
    .option('s, self', 'Apply build for the host workspace')
    .example('submodules build --self')
    .action(async ({ self }: CLI.Options.Submodules) => {
      const workspaceRootPath = await findWorkspaceRootDir();
      const cmd = 'build';
      const { exitCode: submodulesExitCode } = await execa(
        'git',
        ['submodule', 'foreach', 'yarn', cmd],
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
        const { exitCode } = await execa('yarn', [cmd], {
          stdio: [process.stdin, process.stdout, process.stderr],
          cwd: workspaceRootPath
        });
        console.log(
          finished({
            cmd,
            code: exitCode,
            type: 'host'
          })
        );
      }
    });
}
