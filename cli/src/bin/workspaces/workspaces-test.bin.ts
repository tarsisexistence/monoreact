import { Sade } from 'sade';
import execa from 'execa';

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
      const {
        introduce,
        tested,
        testing,
        failed,
        successful,
        running
      } = new WorkspacesMessages();
      const packagesInfo = await getWorkspacesInfo();
      const packagesLocationMap = Object.fromEntries(
        packagesInfo.map(({ name, location }) => [name, location])
      );
      const packageJsons = await readWorkspacePackages(packagesInfo);
      const { chunks, unprocessed } = makeDependencyChunks(packageJsons);
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      clearConsole();

      try {
        console.log(introduce());
        console.log(testing());

        if (!quiet) {
          space();
        }

        const time = process.hrtime();

        for (const chunk of chunks) {
          for (const name of chunk) {
            if (excluded.has(name)) {
              continue;
            }

            if (!quiet) {
              space();
              console.log(running(name));
            }

            await execa('re-space', ['test', '--passWithNoTests'], {
              cwd: packagesLocationMap[name],
              stdio: [process.stdin, process.stdout, process.stderr]
            });

            if (!quiet) {
              console.log(tested(name));
            }
          }
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
