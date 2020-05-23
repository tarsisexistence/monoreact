import { Sade } from 'sade';
import execa from 'execa';

import { workspacesMessage } from '../../shared/messages';
import { clearConsole, logError, space } from '../../shared/utils';
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('wl')
    .option('fix', 'Resolve fixable eslint errors')
    .example('workspaces lint --fix')
    .option('exclude', 'Exclude specific workspaces', '')
    .example('workspaces lint --exclude workspace1,workspace2,workspace3')
    .action(async ({ quiet, exclude, fix }: CLI.Options.Workspaces) => {
      const { chunks, packagesLocationMap } = await exposeWorkspacesInfo();
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      const args = ['lint', 'src/**/*.{js,jsx,ts,tsx}'];

      if (fix) {
        args.push('--fix');
      }

      clearConsole();
      console.log(workspacesMessage.introduce());
      console.log(workspacesMessage.started('lint'));

      try {
        if (!quiet) {
          space();
        }

        const time = process.hrtime();

        for (const chunk of chunks) {
          for (const name of withExcludedWorkspaces(chunk, excluded)) {
            if (!quiet) {
              space();
              console.log(workspacesMessage.running(name));
            }

            try {
              const cwd = packagesLocationMap[name];
              await execa('re-space', args, { cwd, stdio: 'inherit' });
            } catch (error) {
              logError(error);
            }

            if (!quiet) {
              console.log(workspacesMessage.finished('lint', name));
            }
          }
        }

        if (!quiet) {
          space();
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
