import { Sade } from 'sade';
import execa from 'execa';

import { serveMessage, workspacesMessage } from '../../shared/messages';
import { convertStringArrayIntoMap, clearConsole, logError, space } from '../../shared/utils';
import { exposeWorkspaceInfo, withExcludedPackages } from './workspaces.helpers';
import packageJson from '../../../package.json';
import path from 'path';

export function workspacesServeBinCommand(prog: Sade): void {
  prog
    .command('workspaces serve')
    .describe('Serve each workspace')
    .example('workspaces serve')
    .alias('workspaces start', 'workspaces watch', 'ws')
    .option('q, quiet', 'Do not print logs', false)
    .example('workspaces serve --quiet')
    .option('exclude', 'Exclude specific workspaces')
    .example('workspaces serve --exclude  workspace1,workspace2,workspace3')
    .action(async ({ quiet, exclude }: CLI.Options.Workspaces) => {
      const { chunks, packagesLocationMap } = await exposeWorkspaceInfo();
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
            withExcludedPackages(chunk, excluded).map(async name => {
              if (!quiet) {
                console.log(workspacesMessage.running(name));
              }

              const proc = execa('node', [path.resolve(__dirname, '..'), 'serve', '--color'], {
                cwd: packagesLocationMap[name],
                stderr: process.stderr
              });

              proc.stdout?.pipe(process.stdout);

              await new Promise<void>(resolve => {
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
        console.log(workspacesMessage.failed('serve'));
        logError(error);
      }
    });
}
