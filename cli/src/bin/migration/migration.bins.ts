import { Sade } from 'sade';

import { independencyBinCommand } from './independency.bin';

export const migrationBins = (prog: Sade): void => {
  independencyBinCommand(prog);
};
