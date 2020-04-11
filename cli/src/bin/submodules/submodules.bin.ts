import fs from 'fs-extra';
import path from 'path';
import { Sade } from 'sade';

import { SubmodulesMessages } from '../../helpers/messages/submodules.messages';
import { PACKAGE_JSON } from '../../helpers/constants/package.const';
import { error } from '../../helpers/utils/color.utils';
import {
  logError,
  NoPackageJsonError,
  WrongWorkspaceError
} from '../../errors';
import {
  findWorkspacePackage,
  findWorkspaceRoot
} from '../../helpers/utils/package.utils';

export const submodulesBinCommand = (prog: Sade) => {
  prog.action(async (cmd: CLI.Submodules.Command) => {
    const { wrongWorkspace, script } = new SubmodulesMessages(cmd);

    try {
      const packageJsonPath = await fs.realpath(
        path.resolve(process.cwd(), PACKAGE_JSON)
      );

      const { workspaces, private: isPackagePrivate } = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspaceRootPackageJSON;

      if (!workspaces || !isPackagePrivate) {
        throw new WrongWorkspaceError(wrongWorkspace());
      }
    } catch (err) {
      if (err.isWrongWorkspace) {
        console.log(error(err));
      } else {
        console.log(
          error((new NoPackageJsonError(script()) as unknown) as any)
        );
        logError(err);
      }

      process.exit(1);
    }

    try {
      const workspacePackage = await findWorkspacePackage();
      const workspaceRoot = await findWorkspaceRoot();

      if (workspacePackage !== null) {
        //
      }

      if (workspaceRoot !== null) {
        //
      }
    } catch (e) {
      logError(e);
    }
  });
};
