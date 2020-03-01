#!/usr/bin/env node

import sade from 'sade';
import chalk from 'chalk';
import execa from 'execa';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';
import { Input, Select } from 'enquirer';
import { customErrorId, logError } from './errors';
import { preparedPackage, preparingPackage } from './messages';
import { getAuthorName, safePackageName, setAuthorName } from './utils';
import { featureTemplates } from './templates/feature';
import { packageTemplate, packageTemplates } from './templates/package';
import { composePackageJson } from './templates/package/utils';
import { CliOptions } from './config';
import { RootPackageJson, WorkspacePackageJson } from './types';
import pkg from '../package.json';

const prog = sade('re-space');
const templateOptions = Object.keys(packageTemplates);
const featureOptions = Object.keys(featureTemplates);

prog
  .command('add <feature>')
  .describe(
    `Add available feature.
  Currently available choices: [${featureOptions.join(', ')}]`
  )
  .example('add playground')
  .example('a playground')
  .action(async (featureName: string) => {
    const bootSpinner = ora(`Generating ${chalk.cyan(featureName)} feature...`);
    const currentPath = await fs.realpath(process.cwd());
    const packageJsonPath = path.resolve(currentPath, 'package.json');
    let packageJson = {} as WorkspacePackageJson;

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
    
    The workspace package.json should have:
        workspace: true;
          `)
        );
      } else {
        console.log(
          chalk.red(`
    Can't find package.json.
    Make sure you run the script 'add ${featureName}' from the package workspace.
        `)
        );

        logError(error);
      }

      process.exit(1);
    }

    if (!featureOptions.includes(featureName)) {
      bootSpinner.fail(
        `Failed to generate ${chalk.bold.red(featureName)} feature template.`
      );
      console.log(
        chalk.red(`
    Invalid feature template.
    Unfortunately, re-space doesn't provide '${featureName}' feature template.
        `)
      );
      process.exit(1);
    }

    bootSpinner.start();

    try {
      await fs.copy(
        path.resolve(__dirname, `../../templates/feature/${featureName}`),
        path.resolve(currentPath, featureTemplates[featureName].path),
        { overwrite: true }
      );

      const updatedScripts = {
        ...packageJson.scripts,
        ...featureTemplates[featureName].scripts
      };
      await fs.outputJSON(packageJsonPath, {
        ...packageJson,
        scripts: updatedScripts
      });
      await execa('prettier --write package.json');
      bootSpinner.succeed(
        `Added ${chalk.bold.green(featureName)} feature template.`
      );
    } catch (error) {
      `Failed to generate ${chalk.bold.red(featureName)} feature template.`;
      logError(error);
      process.exit(1);
    }
  });

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
     Allowed choices: [${templateOptions.join(', ')}]
     
     `
  )
  .example(`g packageName --template ${templateOptions[0]}`)
  .option(
    '--feature',
    `Specify a feature.
     Allowed choices: [${featureOptions.join(', ')}]
     
     `
  )
  .example(`g packageName --feature ${featureOptions[0]}`)
  .action(async (packageName: string, opts: CliOptions) => {
    const cliConfig: Record<string, any> = {
      scope: null,
      workspaces: null,
      template: null
    };

    try {
      const currentPath = await fs.realpath(process.cwd());
      const packageJsonPath = path.resolve(currentPath, 'package.json');
      const {
        name,
        workspaces,
        private: isPackagePrivate
      } = (await fs.readJSON(packageJsonPath)) as RootPackageJson;
      const hasWorkspace = Array.isArray(workspaces) && workspaces.length > 0;

      if (!hasWorkspace || !isPackagePrivate) {
        throw customErrorId;
      }

      const slashNameIndex = name.indexOf('/');

      cliConfig.scope =
        slashNameIndex === -1 ? `@${name}` : name.slice(0, slashNameIndex);
      cliConfig.workspaces = workspaces[0].replace('*', '');
    } catch (error) {
      if (error === customErrorId) {
        console.log(
          chalk.red(`
    Make sure you run the script 'generate ${packageName}' from the workspace root
    
    The workspace root package.json should have:
        private: false;
        workspaces: ['packages/*'] 
          `)
        );
      } else {
        console.log(
          chalk.red(`
    Can't find package.json.
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
    const bootSpinner = ora(`Generating ${chalk.cyan(packageName)} package...`);

    async function getProjectPath(projectPath: string): Promise<string> {
      const exists = await fs.pathExists(projectPath);

      if (!exists) {
        return projectPath;
      }

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
          `../../templates/package/${cliConfig.template}`
        ),
        projectPath,
        {
          overwrite: true
        }
      );

      // attempt to automatically derive author name
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

      const templateConfig =
        packageTemplates[cliConfig.template as packageTemplate];
      const generatePackageJson = composePackageJson(templateConfig);

      process.chdir(projectPath);
      const safeName = safePackageName(packageName);
      const packageJsonName = cliConfig.scope
        ? `${cliConfig.scope}/${safeName}`
        : safeName;
      const pkgJson = generatePackageJson({ name: packageJsonName, author });
      await fs.outputJSON(path.resolve(projectPath, 'package.json'), pkgJson);
      bootSpinner.succeed(`Generated ${chalk.bold.green(packageName)} package`);
    } catch (error) {
      bootSpinner.fail(
        `Failed to generate ${chalk.bold.red(packageName)} package`
      );
      logError(error);
      process.exit(1);
    }

    const { dependencies } = packageTemplates[
      cliConfig.template as packageTemplate
    ];
    const installSpinner = ora(preparingPackage(dependencies.sort())).start();

    try {
      await execa('sort-package-json');
      await execa('prettier --write package.json');
      installSpinner.succeed('The package successfully configured');
      console.log(await preparedPackage(packageName));
    } catch (error) {
      installSpinner.fail('Failed to fully configure the package');
      logError(error);
      process.exit(1);
    }
  });

prog.version(pkg.version).parse(process.argv);
