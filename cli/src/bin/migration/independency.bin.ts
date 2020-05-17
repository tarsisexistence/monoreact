import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import {
  PACKAGE_JSON,
  TSCONFIG_JSON
} from '../../shared/constants/package.const';
import {
  findWorkspacePackageDir,
  installDependencies,
  logError
} from '../../shared/utils';
import { independencyMessage } from '../../shared/messages';
import { TsconfigJSON } from '../../typings/tsconfig';
import {
  copyIndependencyTemplate,
  makePackageJsonIndependent,
  makeTsconfigJsonIndependent
} from './independency.helpers';

export const independencyBinCommand = (prog: Sade) => {
  prog
    .command('migration independency')
    .describe(
      'Add all necessary settings to the package so that it can function outside of the workspace'
    )
    .example('migration independency')
    .action(async () => {
      const bootSpinner = ora(independencyMessage.generating());
      const packageDir = await findWorkspacePackageDir();
      const packageJsonPath = path.resolve(packageDir, PACKAGE_JSON);
      const tsconfigJsonPath = path.resolve(packageDir, TSCONFIG_JSON);
      const packageJson = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspacePackageJSON;
      const tsconfigJson = (await fs.readJSON(
        tsconfigJsonPath
      )) as TsconfigJSON;
      bootSpinner.start();

      try {
        await makeTsconfigJsonIndependent(tsconfigJsonPath, tsconfigJson);
        await makePackageJsonIndependent(packageJsonPath, packageJson);
        await copyIndependencyTemplate(packageDir);
        await installDependencies();
        bootSpinner.succeed(independencyMessage.successful());
      } catch (err) {
        bootSpinner.fail(independencyMessage.failed());

        logError(err);
        process.exit(1);
      }
    });
};
