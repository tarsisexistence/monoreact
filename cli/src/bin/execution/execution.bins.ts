import { Sade } from 'sade';

import { buildBinCommand } from './build.bin';
import { lintBinCommand } from './lint.bin';
import { watchBinCommand } from './watch.bin';
import { testBinCommand } from './test.bin';
import { installBinCommand } from './install.bin';

export const executionBins = (prog: Sade): void => {
  buildBinCommand(prog);
  lintBinCommand(prog);
  watchBinCommand(prog);
  testBinCommand(prog);
  installBinCommand(prog);
};
