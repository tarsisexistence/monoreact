import { Sade } from 'sade';

import { generateBinCommand } from './generate.bin';
import { addBinCommand } from './add.bin';
import { newBinCommand } from './new.bin';

export const scaffoldingBins = (prog: Sade): void => {
  addBinCommand(prog);
  generateBinCommand(prog);
  newBinCommand(prog);
};
