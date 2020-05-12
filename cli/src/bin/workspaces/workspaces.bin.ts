import { Sade } from 'sade';

import { workspacesBuildBinCommand } from './workspaces-build.bin';

export const workspacesBinCommand = (prog: Sade) => {
  workspacesBuildBinCommand(prog);
};
