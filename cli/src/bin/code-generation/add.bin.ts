import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import { featureTemplates } from '../../setup/add';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { error, findWorkspacePackageDir, logError } from '../../shared/utils';
import { FeatureMessages } from '../../shared/messages';

const featureOptions = Object.keys(featureTemplates);

export const addBinCommand = (prog: Sade) => {
  prog
    .command('add <feature>')
    .describe(
      `Add available feature.
  Currently available choices: [${featureOptions.join(', ')}]`
    )
    .example('add playground')
    .action(async (featureName: string) => {
      const {
        generating,
        failed,
        successful,
        invalidTemplate,
        exists
      } = new FeatureMessages(featureName);
      const bootSpinner = ora(generating());
      const workspacePackage = await findWorkspacePackageDir();
      const packageJsonPath = path.resolve(workspacePackage, PACKAGE_JSON);
      const packageJson = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspacePackageJSON;

      if (!featureOptions.includes(featureName)) {
        bootSpinner.fail(failed());
        console.log(error(invalidTemplate()));
        process.exit(1);
      }

      bootSpinner.start();

      try {
        await fs.copy(
          path.resolve(__dirname, `../../../../templates/add/${featureName}`),
          path.resolve(
            workspacePackage,
            featureTemplates[featureName as CLI.Template.AddType].path
          ),
          { overwrite: false, errorOnExist: true }
        );

        await fs.outputJSON(
          packageJsonPath,
          {
            ...packageJson,
            scripts: {
              ...packageJson.scripts,
              ...featureTemplates[featureName as CLI.Template.AddType].scripts
            }
          },
          { spaces: 2 }
        );
        bootSpinner.succeed(successful());
      } catch (err) {
        bootSpinner.fail(failed());

        if (err.toString().includes('already exists')) {
          console.log(exists());
        }

        logError(err);
        process.exit(1);
      }
    });
};
