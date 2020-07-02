import { Sade } from 'sade';

import { getSubmodulesLocations, findHostDirectory, space } from '../../shared/utils';
import { submodulesMessage } from '../../shared/messages';
import { gitFetch } from './submodules-fetch.helpers';

export function submodulesFetchBinCommand(prog: Sade): void {
  prog
    .command('submodules fetch')
    .describe('Fetch each submodule')
    .example('submodules fetch')
    .alias('sf')
    .option('s, self', 'Apply fetch for the host workspace')
    .example('submodules fetch --self')
    .action(async ({ self }: CLI.Options.Submodules) => {
      const rootDir = await findHostDirectory();
      const locations = await getSubmodulesLocations();

      for (const location of locations) {
        console.log(submodulesMessage.entering(location));
        await gitFetch({ rootDir, repoDir: location });
        space();
      }

      if (self) {
        console.log(submodulesMessage.entering('host'));
        await gitFetch({ rootDir });
        space();
      }
    });
}
