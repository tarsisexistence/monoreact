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
import { IndependencyMessages } from '../../shared/messages';
import { migrationSetup } from '../../setup';
import { TsconfigJSON } from '../../typings/tsconfig';

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
        if (tsconfigJson.compilerOptions !== undefined) {
          const types = 'node_modules/@types';
          tsconfigJson.compilerOptions.typeRoots =
            tsconfigJson.compilerOptions.typeRoots?.filter(
              typeRoot => !typeRoot.includes(types)
            ) ?? [];
          tsconfigJson.compilerOptions.typeRoots.push(types);
        }

        await fs.outputJSON(
          tsconfigJsonPath,
          {
            ...tsconfigJson
          },
          { spaces: 2 }
        );

        await fs.copy(
          path.resolve(
            __dirname,
            '../../../../templates/migration/independency'
          ),
          packageDir,
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
