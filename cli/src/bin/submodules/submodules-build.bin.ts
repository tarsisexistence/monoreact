import { Sade } from 'sade';
import { spawn } from 'child_process';
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
    .option('--self', 'Apply yarn build for the workspace root repository.')
    .example('submodules build --self')
    .action(async ({ self }: CLI.Options.Submodules) => {
      const workspaceRootPath = await getWorkspaceRootPath();
      const child = spawn('yarn', ['build'], { cwd: workspaceRootPath });

      child.stdout.on('data', data => {
        process.stdout.write(data.toString());
      });

      child.stderr.on('data', data => {
        process.stdout.write(data.toString());
      });

      child.on('close', async code => {
        console.log(
          finished({
            cmd: 'build',
            code,
            type: 'submodules'
          })
        );

        if (self) {
          console.log(`
Entering 'core'`);
          const { stderr, stdout, exitCode } = await execa('yarn', ['build'], {
            cwd: workspaceRootPath
          });
          console.log(stdout, stderr);
          console.log(
            finished({
              cmd: 'build',
              code: exitCode,
              type: 'core'
            })
          );
        }
      });
    });
}
