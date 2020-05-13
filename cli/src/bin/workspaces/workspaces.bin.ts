import { Sade } from 'sade';

import { workspacesBuildBinCommand } from './workspaces-build.bin';
import { workspacesTestBinCommand } from './workspaces-test.bin';

export const workspacesBinCommand = (prog: Sade) => {
  workspacesBuildBinCommand(prog);
  workspacesTestBinCommand(prog);
};
