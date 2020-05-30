import { Sade } from 'sade';
import execa from 'execa';

import { workspacesMessage } from '../../shared/messages';
import {
  clearConsole,
  logError,
  normalizeBoolCLI,
  space
} from '../../shared/utils';
import { convertStringArrayIntoMap } from '../../shared/utils/dataStructures.utils';
import {
  exposeWorkspacesInfo,
  withExcludedWorkspaces
} from './workspaces.helpers';
import packageJson from '../../../package.json';

export function workspacesLintBinCommand(prog: Sade): void {
  prog
    .command('workspaces lint')
    .describe('Lint each workspace')
    .example('workspaces lint')
    .alias('wl')
    .option('fix', 'Resolve fixable eslint errors')
    .example('workspaces lint --fix')
    .option('exclude', 'Exclude specific workspaces', '')
    .example('workspaces lint --exclude workspace1,workspace2,workspace3')
    .action(async ({ exclude, fix }: CLI.Options.Workspaces) => {
      const shouldFix = normalizeBoolCLI(fix);
      const { chunks, packagesLocationMap } = await exposeWorkspacesInfo();
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      const args = ['lint', 'src/**/*.{js,jsx,ts,tsx}'];

      if (shouldFix) {
        args.push('--fix');
      }

      clearConsole();
      console.log(workspacesMessage.introduce());
      console.log(workspacesMessage.started('lint'));

      try {
        space();

        const time = process.hrtime();

        for (const chunk of chunks) {
          for (const name of withExcludedWorkspaces(chunk, excluded)) {
            space();
            console.log(workspacesMessage.running(name));

            try {
              const cwd = packagesLocationMap[name];
              await execa('re-space', args, { cwd, stdio: 'inherit' });
            } catch (error) {
              logError(error);
            }

            console.log(workspacesMessage.finished('lint', name));
          }
        }

        const duration = process.hrtime(time);
        console.log(workspacesMessage.successful(duration));
        space();
      } catch (error) {
        console.log(workspacesMessage.failed());
        logError(error);
      }
    });
}
