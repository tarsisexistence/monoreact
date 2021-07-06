import { Sade } from 'sade';

import { detachBinCommand } from './detach.bin';

export const migrationBins = (prog: Sade): void => {
  detachBinCommand(prog);
};
