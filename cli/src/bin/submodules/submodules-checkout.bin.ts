import { Sade } from 'sade';

import { findWorkspaceRootDir, space } from '../../shared/utils';
import { getSubmodulesLocations } from '../../shared/utils/submodules.utils';
import { smartCheckout } from './submodules-checkout.helpers';

export function submodulesCheckoutBinCommand(prog: Sade): void {
  prog
    .command('submodules checkout <branch>')
    .describe('Checkout each submodule on the specific branch')
    .example('submodules checkout branch-name')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sc')
    .option('s, self', 'Apply checkout for the host workspace')
    .example('submodules checkout branch-name --self')
    .action(async (branch: string, { self }: CLI.Options.Submodules) => {
      const rootDir = await findWorkspaceRootDir();
      const locations = await getSubmodulesLocations();

      for (const location of locations) {
        space();
        console.log(`Entering '${location}'`);
        await smartCheckout({ rootDir, repoDir: location, branch });
      }

      space();

      if (self) {
        console.log("Entering 'host'");
        await smartCheckout({ rootDir, branch });
        space();
      }
    });
}
