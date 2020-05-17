import { Sade } from 'sade';
import execa from 'execa';

import { workspacesMessage } from '../../shared/messages';
import { serveMessage } from '../../shared/messages';
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

export function workspacesServeBinCommand(prog: Sade): void {
  prog
    .command('workspaces serve')
    .describe('Serve each workspace')
    .example('workspaces serve')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('workspaces start', 'workspaces watch', 'ws')
    .option(
      'q, quiet',
      'Do not print any information about builds that are in the process',
      false
    )
    .example('workspaces serve --quiet')
    .option('exclude', 'Exclude specific workspaces')
    .example('workspaces serve --exclude  workspace1,workspace2,workspace3')
    .action(async ({ quiet, exclude }: CLI.Options.Workspaces) => {
      const packagesInfo = await getWorkspacesInfo();
      const packagesLocationMap = Object.fromEntries(
        packagesInfo.map(({ name, location }) => [name, location])
      );
      const packageJsons = await readWorkspacePackages(packagesInfo);
      const { chunks, unprocessed } = splitWorkspacesIntoDependencyGraph(
        packageJsons
      );
      const ags = ['serve', '--color'];
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      clearConsole();
      console.log(workspacesMessage.introduce());
      console.log(workspacesMessage.started('serve'));

      if (!quiet) {
        space();
      }

      try {
        const time = process.hrtime();

        for (const chunk of chunks) {
          await Promise.all(
            withExcludedWorkspaces(chunk, excluded).map(async name => {
              if (!quiet) {
                console.log(workspacesMessage.running(name));
              }

              const proc = execa('re-space', ags, {
                cwd: packagesLocationMap[name]
              });

              proc.stdout?.pipe(process.stdout);

              await new Promise(resolve => {
                proc.stdout?.on('data', data => {
                  if (data.toString().includes(serveMessage.compiled(true))) {
                    resolve();
                  }
                });
              });
            })
          );
        }

        if (!quiet) {
          space();
        }

        clearConsole();
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
