import { Sade } from 'sade';
import { spawn } from 'child_process';

import { finished } from './submodules.helpers';

export function submodulesInitBinCommand(prog: Sade): void {
  prog
    .command('submodules init')
    .describe('Initialize missed submodules')
    .example('submodules init')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('si')
    .action(async () => {
      const child = spawn('git', ['submodule', 'update', '--remote', '--init']);

      child.stdout.on('data', data => {
        process.stdout.write(data.toString());
      });

      child.stderr.on('data', data => {
        process.stdout.write(data.toString());
      });

      child.on('close', async code => {
        console.log(
          finished({
            cmd: 'init',
            code,
            type: 'submodules'
          })
        );
      });
    });
}
