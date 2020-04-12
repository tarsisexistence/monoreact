import { Sade } from 'sade';
import execa from 'execa';

import { finished, getWorkspaceRootPath } from './submodules.helpers';

export function submodulesBuildBinCommand(prog: Sade): void {
  prog
    .command('submodules build')
    .describe('Build each submodule')
    .example('submodules build')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sb')
    .option('s, self', 'Apply yarn build for the workspace root repository.')
    .example('submodules build --self')
    .action(async ({ self }: CLI.Options.Submodules) => {
      const workspaceRootPath = await getWorkspaceRootPath();
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
Entering 'core'`);
        const { exitCode } = await execa('yarn', [cmd], {
          stdio: [process.stdin, process.stdout, process.stderr],
          cwd: workspaceRootPath
        });
        console.log(
          finished({
            cmd,
            code: exitCode,
            type: 'core'
          })
        );
      }
    });
}
