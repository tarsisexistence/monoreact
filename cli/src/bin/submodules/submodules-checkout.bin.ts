import { Sade } from 'sade';
import execa from 'execa';

import { getWorkspaceRootPath } from './submodules.helpers';

export function submodulesCheckoutBinCommand(prog: Sade): void {
  prog
    .command('submodules checkout <branch>')
    .describe('Checkout each submodule on the specific branch')
    .example('submodules checkout branch-name')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sc')
    .option('s, self', 'Apply git checkout for the workspace root repository')
    .example('submodules checkout branch-name --self')
    .action(async (branch: string, { self }: CLI.Options.Submodules) => {
      const workspaceRootPath = await getWorkspaceRootPath();
      const cmd = 'checkout';
      await execa(
        'git',
        ['submodule', 'foreach', 'git checkout', '-B', branch],
        {
          stdio: [process.stdin, process.stdout, process.stderr],
          cwd: workspaceRootPath
        }
      );
      console.log(`Finished 'submodules' ${cmd}`);

      if (self) {
        console.log(`
Entering 'core'`);
        await execa('git', ['checkout', '-B', branch], {
          stdio: [process.stdin, process.stdout, process.stderr],
          cwd: workspaceRootPath
        });
        console.log(`Finished 'core' ${cmd}`);
      }
    });
}
