import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';
import { Select } from 'enquirer';

import { featureSetup } from '../../setup/add';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { FeatureMessages } from '../../shared/messages';
import { findWorkspacePackageDir, info, logError } from '../../shared/utils';

const featureOptions = Object.keys(featureSetup);

export const addBinCommand = (prog: Sade) => {
  prog
    .command('add [featureName]')
    .describe(
      `Add available feature.
  Currently available choices: [${featureOptions.join(', ')}]`
    )
    .example('add')
    .example('add playground')
    .action(async (featureName: string = '') => {
      const {
        failed,
        successful,
        adding,
        exists,
        invalidFeatureName
      } = new FeatureMessages();
      let featureOption: CLI.Setup.AddOptionType = featureName as any;

      if (!featureOptions.includes(featureOption)) {
        console.log(invalidFeatureName(featureOption));

        const featureNamePrompt = new Select({
          message: 'Choose a feature',
          choices: featureOptions.map(option => ({
            name: option,
            message: info(option)
          }))
        });
        featureOption = (await featureNamePrompt.run()) as CLI.Setup.AddOptionType;
      }

      const workspacePackage = await findWorkspacePackageDir();
      const packageJsonPath = path.resolve(workspacePackage, PACKAGE_JSON);
      const packageJson = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspacePackageJSON;

      const bootSpinner = ora(adding(featureOption));
      bootSpinner.start();

      try {
        await fs.copy(
          path.resolve(__dirname, `../../../../templates/add/${featureOption}`),
          path.resolve(workspacePackage, featureSetup[featureOption].path),
          { overwrite: false, errorOnExist: true }
        );

        await fs.outputJSON(
          packageJsonPath,
          {
            ...packageJson,
            scripts: {
              ...packageJson.scripts,
              ...featureSetup[featureOption].scripts
            }
          },
          { spaces: 2 }
        );
        bootSpinner.succeed(successful(featureOption));
      } catch (err) {
        bootSpinner.fail(failed(featureOption));

        if (err.toString().includes('already exists')) {
          console.log(exists());
        }

        logError(err);
        process.exit(1);
      }
    });
};
