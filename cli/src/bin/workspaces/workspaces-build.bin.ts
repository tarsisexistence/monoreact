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

export function workspacesBuildBinCommand(prog: Sade): void {
  prog
    .command('workspaces build')
    .describe('Build each workspace')
    .example('workspaces build')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('wb')
    .option('o, only', 'Build only specific workspaces')
    .option('e, exclude', 'Exclude specific workspaces')
    .option(
      'q, quiet',
      'Do not print any information about builds that are in the process',
      false
    )
    .example('workspaces build --self')
    .action(async ({ quiet }: CLI.Options.Workspaces) => {
      const {
        introduce,
        compiled,
        compiling,
        failed,
        successful,
        entering
      } = new WorkspacesMessages();
      const jobs = Math.max(1, cpus().length / 2);
      const limit = pLimit(jobs);
      const packagesInfo = await getWorkspacesInfo();
      const packagesLocationMap = Object.fromEntries(
        packagesInfo.map(({ name, location }) => [name, location])
      );
      const packageJsons = await readWorkspacePackages(packagesInfo);
      const { chunks, unprocessed } = makeDependencyChunks(packageJsons);

      clearConsole();

      try {
        console.log(introduce());
        console.log(compiling());
        if (!quiet) {
          space();
        }

        const time = process.hrtime();

        for (const chunk of chunks) {
          await Promise.all(
            chunk.map(async name =>
              limit(async () => {
                if (!quiet) {
                  console.log(entering(name));
                }

                await execa('yarn', ['build'], {
                  cwd: packagesLocationMap[name]
                });

                if (!quiet) {
                  console.log(compiled(name));
                }
              })
            )
          );
        }

        const duration = process.hrtime(time);
        if (!quiet) {
          space();
        }

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
