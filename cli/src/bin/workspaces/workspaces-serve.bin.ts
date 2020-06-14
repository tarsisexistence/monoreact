import { Sade } from 'sade';
import execa from 'execa';

import { workspacesMessage } from '../../shared/messages';
import { serveMessage } from '../../shared/messages';
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

export function workspacesServeBinCommand(prog: Sade): void {
  prog
    .command('workspaces serve')
    .describe('Serve each workspace')
    .example('workspaces serve')
    .alias('workspaces start', 'workspaces watch', 'ws')
    .option(
      'q, quiet',
      'Do not print any information about builds that are in the process'
    )
    .example('workspaces serve --quiet')
    .option('exclude', 'Exclude specific workspaces')
    .example('workspaces serve --exclude  workspace1,workspace2,workspace3')
    .action(async ({ quiet, exclude }: CLI.Options.Workspaces) => {
      const showExtraMessages = !normalizeBoolCLI(quiet);
      const { chunks, packagesLocationMap } = await exposeWorkspacesInfo();
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      clearConsole();
      console.log(workspacesMessage.introduce());
      console.log(workspacesMessage.started('serve'));

      if (showExtraMessages) {
        space();
      }

      try {
        const time = process.hrtime();

        for (const chunk of chunks) {
          await Promise.all(
            withExcludedWorkspaces(chunk, excluded).map(async name => {
              if (showExtraMessages) {
                console.log(workspacesMessage.running(name));
              }

              const proc = execa('re-space', ['serve', '--color'], {
                cwd: packagesLocationMap[name],
                stderr: process.stderr
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

        if (showExtraMessages) {
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
    });
}
