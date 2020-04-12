import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import {
  logError,
  NoPackageJsonError,
  WrongWorkspaceError
} from '../../errors';
import { featureTemplates } from '../../setup/feature';
import { PACKAGE_JSON } from '../../helpers/constants/package.const';
import { FeatureMessages } from '../../helpers/messages/feature.messages';
import { prettifyPackageJson } from '../../helpers/utils/package.utils';
import { error } from '../../helpers/utils/color.utils';

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
        wrongWorkspace,
        failed,
        successful,
        invalidTemplate,
        exists,
        script
      } = new FeatureMessages(featureName);
      const bootSpinner = ora(generating());
      const currentPath = await fs.realpath(process.cwd());
      const packageJsonPath = path.resolve(currentPath, PACKAGE_JSON);
      let packageJson = {} as CLI.Package.WorkspacePackageJSON;

      try {
        packageJson = await fs.readJSON(packageJsonPath);

        if (!packageJson.workspace) {
          throw new WrongWorkspaceError(wrongWorkspace());
        }
      } catch (err) {
        bootSpinner.fail(failed());

        if (err.isWrongWorkspace) {
          console.log(error(err));
        } else {
          console.log(
            error((new NoPackageJsonError(script()) as unknown) as string)
          );
          logError(err);
        }

        process.exit(1);
      }

      if (!featureOptions.includes(featureName)) {
        bootSpinner.fail(failed());
        console.log(error(invalidTemplate()));
        process.exit(1);
      }

      bootSpinner.start();

      try {
        await fs.copy(
          path.resolve(
            __dirname,
            `../../../../templates/feature/${featureName}`
          ),
          path.resolve(
            currentPath,
            featureTemplates[featureName as CLI.Template.Feature].path
          ),
          { overwrite: false, errorOnExist: true }
        );

        const updatedScripts = {
          ...packageJson.scripts,
          ...featureTemplates[featureName as CLI.Template.Feature].scripts
        };
        await fs.outputJSON(packageJsonPath, {
          ...packageJson,
          scripts: updatedScripts
        });
        await prettifyPackageJson();
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
