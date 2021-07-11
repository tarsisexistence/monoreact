import { Sade } from 'sade';

import { workspacesBuildBinCommand } from './workspaces-build.bin';
import { workspacesTestBinCommand } from './workspaces-test.bin';
import { workspacesLintBinCommand } from './workspaces-lint.bin';
import { workspacesWatchBinCommand } from './workspaces-watch.bin';

export const workspacesBins = (prog: Sade): void => {
  workspacesBuildBinCommand(prog);
  workspacesLintBinCommand(prog);
  workspacesWatchBinCommand(prog);
  workspacesTestBinCommand(prog);
};
