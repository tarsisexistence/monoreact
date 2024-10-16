import { Sade } from 'sade';
import path from 'path';
import execa from 'execa';

import { workspacesMessage } from '../../shared/messages';
import { convertStringArrayIntoMap, clearConsole, logError, space } from '../../shared/utils';
import { exposeWorkspaceInfo, withExcludedPackages } from './workspaces.helpers';
import packageJson from '../../../package.json';

export function workspacesBuildBinCommand(prog: Sade): void {
  prog
    .command('workspaces build')
    .describe('Build all workspaces.')
    .example('workspaces build')
    .alias('wb')
    .option('q, quiet', 'Do not print logs', false)
    .example('workspaces build --quiet')
    .option('e, exclude', 'Exclude specific workspaces')
    .example('workspaces build --exclude  workspace1,workspace2,workspace3')
    .action(async ({ quiet, exclude }: CLI.Options.Workspaces) => {
      const { chunks, packagesLocationMap } = await exposeWorkspaceInfo();
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      clearConsole();
      console.log(workspacesMessage.introduce());
      console.log(workspacesMessage.started('build'));

      if (!quiet) {
        space();
      }

      try {
        const time = process.hrtime();
        for (const chunk of chunks) {
          await Promise.all(
            withExcludedPackages(chunk, excluded).map(async name => {
              if (!quiet) {
                console.log(workspacesMessage.running(name));
              }

              const { stderr, exitCode, failed } = await execa('node', [path.resolve(__dirname, '../'), 'build'], {
                cwd: packagesLocationMap[name]
              });

              if (!quiet) {
                // TODO: refactor when build/serveWorkspace ready
                const isError = exitCode !== 0 || failed;
                const errorText = stderr !== '' && stderr !== undefined ? stderr : 'Unknown error';

                if (isError) {
                  throw new Error(errorText);
                }

                console.log(workspacesMessage.finished('build', name));
              }
            })
          );
        }

        if (!quiet) {
          space();
        }

        const duration = process.hrtime(time);
        console.log(workspacesMessage.successful(duration));
        space();
      } catch (error) {
        console.log(workspacesMessage.failed('build'));
        logError(error as Error);
        process.exit(1);
      }
    });
}
