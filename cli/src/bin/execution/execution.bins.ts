import { Sade } from 'sade';

import { buildBinCommand } from './build.bin';
import { lintBinCommand } from './lint.bin';
import { serveBinCommand } from './serve.bin';
import { testBinCommand } from './test.bin';
import { installBinCommand } from './install.bin';

export const executionBins = (prog: Sade): void => {
  buildBinCommand(prog);
  lintBinCommand(prog);
  serveBinCommand(prog);
  testBinCommand(prog);
  installBinCommand(prog);
};
