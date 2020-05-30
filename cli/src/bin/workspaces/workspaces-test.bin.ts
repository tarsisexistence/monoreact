import { Sade } from 'sade';
import execa from 'execa';

import { workspacesMessage } from '../../shared/messages';
import { clearConsole, logError, space } from '../../shared/utils';
import { convertStringArrayIntoMap } from '../../shared/utils/dataStructures.utils';
import {
  exposeWorkspacesInfo,
  withExcludedWorkspaces
} from './workspaces.helpers';
import packageJson from '../../../package.json';

export function workspacesTestBinCommand(prog: Sade): void {
  prog
    .command('workspaces test')
    .describe('Test each workspace')
    .example('workspaces test')
    .alias('wt')
    .option('exclude', 'Exclude specific workspaces', '')
    .example('workspaces test --exclude workspace1,workspace2,workspace3')
    .action(async ({ quiet, exclude }: CLI.Options.Workspaces) => {
      const { chunks, packagesLocationMap } = await exposeWorkspacesInfo();
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      clearConsole();
      console.log(workspacesMessage.introduce());
      console.log(workspacesMessage.started('test'));

      try {
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
              stdio: 'inherit'
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
    });
}
