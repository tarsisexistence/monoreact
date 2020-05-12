import { Sade } from 'sade';

import { submodulesCheckoutBinCommand } from './submodules-checkout.bin';
import { submodulesFetchBinCommand } from './submodules-fetch.bin';
import { submodulesInitBinCommand } from './submodules-init.bin';
import { submodulesPullBinCommand } from './submodules-pull.bin';

export const submodulesBinCommand = (prog: Sade) => {
  submodulesCheckoutBinCommand(prog);
  submodulesFetchBinCommand(prog);
  submodulesInitBinCommand(prog);
  submodulesPullBinCommand(prog);
};
