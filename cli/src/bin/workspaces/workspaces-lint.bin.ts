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
      const {
        introduce,
        started,
        finished,
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

      const args = ['lint', 'src/**/*.{js,jsx,ts,tsx}'];

      if (fix) {
        args.push('--fix');
      }

      clearConsole();

      try {
        console.log(introduce());
        console.log(started('lint'));

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

            try {
              await execa('re-space', args, {
                cwd: packagesLocationMap[name],
                stdio: [process.stdin, process.stdout, process.stderr]
              });
            } catch (error) {
              logError(error);
            }

            if (!quiet) {
              console.log(finished('lint', name));
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
