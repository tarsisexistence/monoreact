import { Sade } from 'sade';

import { workspacesBuildBinCommand } from './workspaces-build.bin';
import { workspacesTestBinCommand } from './workspaces-test.bin';
import { workspacesLintBinCommand } from './workspaces-lint.bin';
import { workspacesServeBinCommand } from './workspaces-serve.bin';

export const workspacesBins = (prog: Sade): void => {
  workspacesBuildBinCommand(prog);
  workspacesLintBinCommand(prog);
  workspacesServeBinCommand(prog);
  workspacesTestBinCommand(prog);
};
