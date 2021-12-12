import { Sade } from 'sade';
import execa from 'execa';
import path from 'path';

import { workspacesMessage } from '../../shared/messages';
import { convertStringArrayIntoMap, clearConsole, logError, space } from '../../shared/utils';
import { exposeWorkspaceInfo, withExcludedPackages } from './workspaces.helpers';
import packageJson from '../../../package.json';

export function workspacesLintBinCommand(prog: Sade): void {
  prog
    .command('workspaces lint')
    .describe('Lint all workspaces.')
    .example('workspaces lint')
    .alias('wl')
    .option('fix', 'Resolve fixable eslint errors', false)
    .example('workspaces lint --fix')
    .option('exclude', 'Exclude specific workspaces', '')
    .example('workspaces lint --exclude workspace1,workspace2,workspace3')
    .action(async ({ exclude, fix }: CLI.Options.Workspaces) => {
      const { chunks, packagesLocationMap } = await exposeWorkspaceInfo();
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      const args = [path.resolve(__dirname, '..'), 'lint', 'src/**/*.{js,jsx,ts,tsx}'];

      if (fix) {
        args.push('--fix');
      }

      clearConsole();
      console.log(workspacesMessage.introduce());
      console.log(workspacesMessage.started('lint'));

      try {
        space();

        const time = process.hrtime();

        for (const chunk of chunks) {
          for (const name of withExcludedPackages(chunk, excluded)) {
            space();
            console.log(workspacesMessage.running(name));

            try {
              const cwd = packagesLocationMap[name];

              await execa('node', args, { cwd, stdio: 'inherit' });
            } catch (error) {
              logError(error as Error);
            }

            console.log(workspacesMessage.finished('lint', name));
          }
        }

        const duration = process.hrtime(time);
        console.log(workspacesMessage.successful(duration));
        space();
      } catch (error) {
        console.log(workspacesMessage.failed('lint'));
        logError(error as Error);
        process.exit(1);
      }
    });
}
