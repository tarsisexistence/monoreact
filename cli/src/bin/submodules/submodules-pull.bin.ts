import { Sade } from 'sade';

import { getSubmodulesLocations, findHostDirectory, space } from '../../shared/utils';
import { submodulesMessage } from '../../shared/messages';
import { gitPull } from './submodules-pull.helpers';

export function submodulesPullBinCommand(prog: Sade): void {
  prog
    .command('submodules pull [branch]')
    .describe('Pull all submodules (default: master).')
    .example('submodules pull')
    .example('submodules pull develop')
    .alias('sp')
    .option('r, remote', 'Define git remote', 'origin')
    .example('submodules pull master --remote fork')
    .option('s, self', 'Apply pull for the host workspace')
    .example('submodules pull --self')
    .action(async (branch = 'master', { self, remote }: CLI.Options.SubmodulesPull) => {
      const rootDir = await findHostDirectory();
      const locations = await getSubmodulesLocations();

      for (const location of locations) {
        console.log(submodulesMessage.entering(location));
        await gitPull({ rootDir, repoDir: location, remote, branch });
        space();
      }

      if (self) {
        console.log(submodulesMessage.entering('host'));
        await gitPull({ rootDir, remote, branch });
        space();
      }
    });
}
