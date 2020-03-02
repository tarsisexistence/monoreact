#!/usr/bin/env node

import chalk from 'chalk';
import execa from 'execa';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';
import { Input, Select } from 'enquirer';
import { customErrorId, logError } from '../errors';
import { preparedPackage, preparingPackage } from '../messages';
import { getAuthorName, setAuthorName } from '../utils';
import { featureTemplates } from '../templates/feature';
import { packageTemplate, packageTemplates } from '../templates/package';
import { composePackageJson } from '../templates/package/utils';
import { CliOptions } from '../config';
import { RootPackageJson } from '../types';
import { PACKAGE_JSON } from '../constants';

const templateOptions = Object.keys(packageTemplates);
const featureOptions = Object.keys(featureTemplates);

export const generateBinCommand = (prog: any) => {
  prog
    .command('generate <pkg>', 'Generate a new package', {
      // @ts-ignore
      alias: ['g']
    })
    .example('generate packageName')
    .example('g packageName')
    .option(
      '--template',
      `Specify a template.
     Available templates: [${templateOptions.join(', ')}]
     
     `
    )
    .example(`g packageName --template ${templateOptions[0]}`)
    .option(
      '--feature',
      `Specify a feature.
     Available features: [${featureOptions.join(', ')}]
     
     `
    )
    .example(`g packageName --feature ${featureOptions[0]}`)
    .action(async (packageName: string, opts: CliOptions) => {
      const cliConfig: Record<string, any> = {
        template: null,
        workspaces: null,
        rootWorkspaceName: null,
        license: null
      };

      try {
        const currentPath = await fs.realpath(process.cwd());
        const packageJsonPath = path.resolve(currentPath, PACKAGE_JSON);

        const {
          name,
          workspaces,
          license,
          private: isPackagePrivate
        } = (await fs.readJSON(packageJsonPath)) as RootPackageJson;
        const hasWorkspace = Array.isArray(workspaces) && workspaces.length > 0;

        if (!hasWorkspace || !isPackagePrivate) {
          throw customErrorId;
        }

        cliConfig.license = license;
        cliConfig.rootWorkspaceName = name;
        cliConfig.workspaces = workspaces[0].replace('*', '');
      } catch (error) {
        if (error === customErrorId) {
          console.log(
            chalk.red(`
    Make sure you run the script 'generate ${packageName}' from the workspace root
    
    The workspace root ${PACKAGE_JSON} should have:
        private: false;
        workspaces: ['packages/*'] 
          `)
          );
        } else {
          console.log(
            chalk.red(`
    Can't find ${PACKAGE_JSON}.
    Make sure you run the script 'generate ${packageName}' from the workspace root.
      `)
          );

          logError(error);
        }

        process.exit(1);
      }

      console.log(
        chalk.bold.yellow(`
  RE SPACE // CLI
    `)
      );
      const bootSpinner = ora(
        `Generating ${chalk.cyan(packageName)} package...`
      );

      async function getProjectPath(projectPath: string): Promise<string> {
        const exists = await fs.pathExists(projectPath);

        if (!exists) {
          return projectPath;
        }

        console.log(projectPath);
        bootSpinner.fail(
          `Failed to generate ${chalk.bold.red(packageName)} package`
        );
        const prompt = new Input({
          message: `A folder named ${chalk.bold.red(
            packageName
          )} already exists! ${chalk.bold('Choose a different name')}`,
          initial: packageName + '-copy',
          result: (v: string) => v.trim()
        });

        packageName = await prompt.run();
        // refactor
        projectPath =
          (await fs.realpath(process.cwd())) +
          '/' +
          cliConfig.workspaces +
          packageName;
        return await getProjectPath(projectPath);
      }

      try {
        const realPath = await fs.realpath(process.cwd());
        const projectPath = await getProjectPath(
          `${realPath}/${cliConfig.workspaces}/${packageName}`
        );

        const prompt = new Select({
          message: 'Choose a template',
          choices: templateOptions.map(option => ({
            name: option,
            message: chalk.cyan(option)
          }))
        });

        if (opts.template) {
          cliConfig.template = opts.template.trim();

          if (
            !prompt.choices.find(
              (choice: any) => choice.name === cliConfig.template
            )
          ) {
            bootSpinner.fail(
              `Invalid template ${chalk.bold.red(cliConfig.template)}`
            );
            cliConfig.template = await prompt.run();
          }
        } else {
          cliConfig.template = await prompt.run();
        }

        bootSpinner.start();
        await fs.copy(
          path.resolve(
            __dirname,
            `../../../templates/package/${cliConfig.template}`
          ),
          projectPath,
          {
            overwrite: true
          }
        );

        let author = getAuthorName();

        if (!author) {
          bootSpinner.stop();
          const licenseInput = new Input({
            name: 'author',
            message: 'Who is the package author?'
          });
          author = await licenseInput.run();
          setAuthorName(author);
          bootSpinner.start();
        }

        process.chdir(projectPath);
        const templateConfig =
          packageTemplates[cliConfig.template as packageTemplate];
        const generatePackageJson = composePackageJson(templateConfig);
        const pkgJson = generatePackageJson({
          author,
          name: packageName,
          rootName: cliConfig.rootWorkspaceName,
          license: cliConfig.license
        });
        await fs.outputJSON(path.resolve(projectPath, PACKAGE_JSON), pkgJson);
        bootSpinner.succeed(
          `Generated ${chalk.bold.green(packageName)} package`
        );
      } catch (error) {
        bootSpinner.fail(`Failed to generate ${chalk.bold.red(packageName)} package`);
        logError(error);
        process.exit(1);
      }

      const { dependencies } = packageTemplates[
        cliConfig.template as packageTemplate
      ];
      const installSpinner = ora(preparingPackage(dependencies.sort())).start();

      try {
        await execa('sort-package-json');
        await execa(`prettier --write ${PACKAGE_JSON}`);
        installSpinner.succeed('The package successfully configured');
        console.log(await preparedPackage(packageName));
      } catch (error) {
        installSpinner.fail('Failed to fully configure the package');
        logError(error);
        process.exit(1);
      }
    });
};
