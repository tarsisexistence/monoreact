import { Sade } from 'sade';
import execa from 'execa';

import { workspacesMessage } from '../../shared/messages';
import {
  getWorkspacesInfo,
  splitWorkspacesIntoDependencyGraph,
  readWorkspacePackages,
  clearConsole,
  logError,
  space
} from '../../shared/utils';
import { convertStringArrayIntoMap } from '../../shared/utils/dataStructures.utils';
import {
  handleUnprocessedWorkspaces,
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
      const packagesInfo = await getWorkspacesInfo();
      const packagesLocationMap = Object.fromEntries(
        packagesInfo.map(({ name, location }) => [name, location])
      );
      const packageJsons = await readWorkspacePackages(packagesInfo);
      const { chunks, unprocessed } = splitWorkspacesIntoDependencyGraph(
        packageJsons
      );
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      const args = ['lint', 'src/**/*.{js,jsx,ts,tsx}'];

      if (fix) {
        args.push('--fix');
      }

      clearConsole();

      try {
        console.log(workspacesMessage.introduce());
        console.log(workspacesMessage.started('lint'));

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
              await execa('re-space', args, {
                cwd: packagesLocationMap[name],
                stdio: [process.stdin, process.stdout, process.stderr]
              });
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

      if (unprocessed.length > 0) {
        handleUnprocessedWorkspaces(unprocessed);
      }
    });
}
