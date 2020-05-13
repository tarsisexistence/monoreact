import { Sade } from 'sade';

import { workspacesBuildBinCommand } from './workspaces-build.bin';
import { workspacesTestBinCommand } from './workspaces-test.bin';
import { workspacesLintBinCommand } from './workspaces-lint.bin';
import { workspacesServeBinCommand } from './workspaces-serve.bin';

export const workspacesBinCommand = (prog: Sade) => {
  workspacesBuildBinCommand(prog);
  workspacesLintBinCommand(prog);
  workspacesServeBinCommand(prog);
  workspacesTestBinCommand(prog);
};
