import chalk from 'chalk';
import execa from 'execa';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';
import { customErrorId, logError } from '../errors';
import { featureTemplates } from '../templates/feature';
import { PACKAGE_JSON } from '../constants';

const featureOptions = Object.keys(featureTemplates);

export const addBinCommand = (prog: any) => {
  prog
    .command('add <feature>')
    .describe(
      `Add available feature.
  Currently available choices: [${featureOptions.join(', ')}]`
    )
    .example('add playground')
    .action(async (featureName: string) => {
      const bootSpinner = ora(
        `Generating ${chalk.cyan(featureName)} feature...`
      );
      const currentPath = await fs.realpath(process.cwd());
      const packageJsonPath = path.resolve(currentPath, PACKAGE_JSON);
      let packageJson = {} as CLI.Package.WorkspacePackageJSON;

      try {
        packageJson = await fs.readJSON(packageJsonPath);

        if (!packageJson.workspace) {
          throw customErrorId;
        }
      } catch (error) {
        bootSpinner.fail(
          `Failed to generate ${chalk.bold.red(featureName)} feature template`
        );

        if (error === customErrorId) {
          console.log(
            chalk.red(`
    Make sure you run the script 'add ${featureName}' from the package workspace.
    
    The workspace ${PACKAGE_JSON} should have:
        workspace: true;
          `)
          );
        } else {
          console.log(
            chalk.red(`
    Can't find ${PACKAGE_JSON}.
    Make sure you run the script 'add ${featureName}' from the package workspace.
        `)
          );

          logError(error);
        }

        process.exit(1);
      }

      if (!featureOptions.includes(featureName)) {
        bootSpinner.fail(
          `Failed to generate ${chalk.bold.red(featureName)} feature template`
        );
        console.log(
          chalk.red(`
    Invalid feature template.
    Unfortunately, re-space doesn't provide '${featureName}' feature template.
    
    Available feature templates: [${featureOptions.join(', ')}]
        `)
        );
        process.exit(1);
      }

      bootSpinner.start();

      try {
        await fs.copy(
          path.resolve(__dirname, `../../../templates/feature/${featureName}`),
          path.resolve(
            currentPath,
            featureTemplates[featureName as CLI.Template.feature].path
          ),
          { overwrite: false, errorOnExist: true }
        );

        const updatedScripts = {
          ...packageJson.scripts,
          ...featureTemplates[featureName as CLI.Template.feature].scripts
        };
        await fs.outputJSON(packageJsonPath, {
          ...packageJson,
          scripts: updatedScripts
        });
        await execa(`prettier --write ${PACKAGE_JSON}`);
        bootSpinner.succeed(
          `Added ${chalk.bold.green(featureName)} feature template`
        );
      } catch (error) {
        bootSpinner.fail(
          `Failed to generate ${chalk.bold.red(featureName)} feature template`
        );

        if (error.toString().includes('already exists')) {
          console.log(
            chalk.red(`
    It seems like you already have this feature.
        `)
          );
        }

        logError(error);
        process.exit(1);
      }
    });
};
