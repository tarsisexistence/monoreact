import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import { NoPackageJsonError, WrongWorkspaceError } from '../../shared/models';
import { featureTemplates } from '../../setup/add';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { error, logError, prettifyPackageJson } from '../../shared/utils';
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
          path.resolve(__dirname, `../../../../templates/add/${featureName}`),
          path.resolve(
            currentPath,
            featureTemplates[featureName as CLI.Template.AddType].path
          ),
          { overwrite: false, errorOnExist: true }
        );

        const updatedScripts = {
          ...packageJson.scripts,
          ...featureTemplates[featureName as CLI.Template.AddType].scripts
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
