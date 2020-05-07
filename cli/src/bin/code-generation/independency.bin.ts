import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import { PACKAGE_JSON } from '../../shared/constants/package.const';
import {
  findWorkspacePackageDir,
  installDependencies,
  logError
} from '../../shared/utils';
import { IndependencyMessages } from '../../shared/messages';
import { migrationSetup } from '../../setup';

export const independencyBinCommand = (prog: Sade) => {
  prog
    .command('migration independency')
    .describe(
      'Add all necessary settings to the package so that it can function outside of the workspace'
    )
    .example('migration independency')
    .action(async () => {
      const { failed, generating, successful } = new IndependencyMessages();
      const bootSpinner = ora(generating());
      const workspacePackage = await findWorkspacePackageDir();
      const packageJsonPath = path.resolve(workspacePackage, PACKAGE_JSON);
      let packageJson = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspacePackageJSON;

      bootSpinner.start();

      try {
        await fs.copy(
          path.resolve(
            __dirname,
            '../../../../templates/migration/independency'
          ),
          workspacePackage,
          { overwrite: true, errorOnExist: false }
        );

        await fs.outputJSON(
          packageJsonPath,
          {
            ...packageJson,
            ...migrationSetup.independency
          },
          { spaces: 2 }
        );
        installDependencies();
        bootSpinner.succeed(successful());
      } catch (err) {
        bootSpinner.fail(failed());

        logError(err);
        process.exit(1);
      }
    });
};
