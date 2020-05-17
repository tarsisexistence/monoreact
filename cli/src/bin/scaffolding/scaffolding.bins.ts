import { Sade } from 'sade';

import { generateBinCommand } from './generate.bin';
import { addBinCommand } from './add.bin';

export const scaffoldingBins = (prog: Sade): void => {
  generateBinCommand(prog);
  addBinCommand(prog);
};
