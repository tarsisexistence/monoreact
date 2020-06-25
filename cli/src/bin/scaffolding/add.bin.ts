import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import { featureSetup } from './setup/add';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { addMessage } from '../../shared/messages';
import { findWorkspacePackageDir, logError } from '../../shared/utils';
import { addFeatureScriptsToPackageJson, copyFeatureTemplate, validateFeatureOption } from './add.helpers';

const featureOptions = Object.keys(featureSetup);

export const addBinCommand = (prog: Sade): void => {
  prog
    .command('add [featureName]')
    .describe(`Add available feature [${featureOptions.join(', ')}]`)
    .example('add')
    .example('add playground')
    .action(async (featureName = '') => {
      const featureOption: CLI.Setup.AddOptionType = await validateFeatureOption(featureName, featureOptions, () =>
        console.log(addMessage.invalidFeatureName(featureOption))
      );
      const packageDir = await findWorkspacePackageDir();
      const packageJsonPath = path.resolve(packageDir, PACKAGE_JSON);
      const packageJson = (await fs.readJSON(packageJsonPath)) as CLI.Package.WorkspacePackageJSON;

      const bootSpinner = ora(addMessage.adding(featureOption));
      bootSpinner.start();

      try {
        await copyFeatureTemplate(packageDir, featureOption);
        await addFeatureScriptsToPackageJson({
          dir: packageJsonPath,
          packageJson,
          option: featureOption
        });
        bootSpinner.succeed(addMessage.successful(featureOption));
      } catch (err) {
        bootSpinner.fail(addMessage.failed(featureOption));

        if (err.toString().includes('already exists')) {
          console.log(addMessage.exists());
        }

        logError(err);
        process.exit(1);
      }
    });
};
