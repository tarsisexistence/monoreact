import { Sade } from 'sade';

import { independencyBinCommand} from './independency.bin';

export const migrationBins = (prog: Sade) => {
  independencyBinCommand(prog);
};
