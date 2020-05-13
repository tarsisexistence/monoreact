import { Sade } from 'sade';
import execa from 'execa';
import { cpus } from 'os';
import pLimit from 'p-limit';

import { WorkspacesMessages } from '../../shared/messages/workspaces.messages';
import {
  getWorkspacesInfo,
  makeDependencyChunks,
  readWorkspacePackages,
  error,
  clearConsole,
  logError,
  space
} from '../../shared/utils';
import { convertStringArrayIntoMap } from '../../shared/utils/dataStructures.utils';
import packageJson from '../../../package.json';
import { ServeMessages } from '../../shared/messages';

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
      const {
        introduce,
        started,
        failed,
        successful,
        running
      } = new WorkspacesMessages();
      const { compiled } = new ServeMessages();
      const jobs = Math.max(1, cpus().length / 2);
      const limit = pLimit(jobs);
      const packagesInfo = await getWorkspacesInfo();
      const packagesLocationMap = Object.fromEntries(
        packagesInfo.map(({ name, location }) => [name, location])
      );
      const packageJsons = await readWorkspacePackages(packagesInfo);
      const { chunks, unprocessed } = makeDependencyChunks(packageJsons);
      const ags = ['serve', '--color'];
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      clearConsole();
      console.log(introduce());
      console.log(started('serve'));

      if (!quiet) {
        space();
      }

      try {
        const time = process.hrtime();
        for (const chunk of chunks) {
          await Promise.all(
            chunk.map(async name =>
              limit(async () => {
                if (excluded.has(name)) {
                  return;
                }

                if (!quiet) {
                  console.log(running(name));
                }

                const proc = execa('re-space', ags, {
                  cwd: packagesLocationMap[name]
                });

                proc.stdout?.pipe(process.stdout);

                await new Promise(resolve => {
                  proc.stdout?.on('data', data => {
                    if (data.toString().includes(compiled(true))) {
                      resolve();
                    }
                  });
                });
              })
            )
          );
        }

        const duration = process.hrtime(time);

        if (!quiet) {
          space();
        }

        clearConsole();
        console.log(successful(duration));
        space();
      } catch (error) {
        console.log(failed());
        logError(error);
      }

      if (unprocessed.length > 0) {
        console.log(
          error(`Potentially circular dependency
      Please check the following packages attentively:
      ${unprocessed.map(
        ([name, dependencies]) =>
          `   ${name}  =>  ${dependencies?.join(', ') ?? ''}`
      ).join(`
      `)}
      `)
        );
      }
    });
}
