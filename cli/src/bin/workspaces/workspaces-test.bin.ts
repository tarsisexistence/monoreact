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

export function workspacesTestBinCommand(prog: Sade): void {
  prog
    .command('workspaces test')
    .describe('Test each workspace')
    .example('workspaces test')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('wt')
    .option('exclude', 'Exclude specific workspaces', '')
    .example('workspaces test --exclude workspace1,workspace2,workspace3')
    .action(async ({ quiet, exclude }: CLI.Options.Workspaces) => {
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

      clearConsole();

      try {
        console.log(workspacesMessage.introduce());
        console.log(workspacesMessage.started('test'));

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

            await execa('re-space', ['test', '--passWithNoTests'], {
              cwd: packagesLocationMap[name],
              stdio: [process.stdin, process.stdout, process.stderr]
            });

            if (!quiet) {
              console.log(workspacesMessage.finished('test', name));
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
