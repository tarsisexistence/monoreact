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

export function workspacesBuildBinCommand(prog: Sade): void {
  prog
    .command('workspaces build')
    .describe('Build each workspace')
    .example('workspaces build')
    .alias('wb')
    .option(
      'q, quiet',
      'Do not print any information about builds that are in the process'
    )
    .example('workspaces build --quiet')
    .option('e, exclude', 'Exclude specific workspaces')
    .example('workspaces build --exclude  workspace1,workspace2,workspace3')
    .action(async ({ quiet, exclude }: CLI.Options.Workspaces) => {
      const showExtraMessages = !normalizeBoolCLI(quiet);
      const { chunks, packagesLocationMap } = await exposeWorkspacesInfo();
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      clearConsole();
      console.log(workspacesMessage.introduce());
      console.log(workspacesMessage.started('build'));

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

              const { stderr } = await execa('re-space', ['build'], {
                cwd: packagesLocationMap[name]
              });

              if (showExtraMessages) {
                // TODO: refactor when build/serveWorkspace ready
                if (stderr !== '' && stderr !== undefined) {
                  throw new Error(stderr);
                }

                console.log(workspacesMessage.finished('build', name));
              }
            })
          );
        }

        if (showExtraMessages) {
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
