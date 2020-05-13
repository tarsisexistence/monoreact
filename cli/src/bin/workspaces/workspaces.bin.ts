import { Sade } from 'sade';

import { workspacesBuildBinCommand } from './workspaces-build.bin';
import { workspacesTestBinCommand } from './workspaces-test.bin';
import { workspacesLintBinCommand } from './workspaces-lint.bin';

export const workspacesBinCommand = (prog: Sade) => {
  workspacesBuildBinCommand(prog);
  workspacesLintBinCommand(prog);
  workspacesTestBinCommand(prog);
};
