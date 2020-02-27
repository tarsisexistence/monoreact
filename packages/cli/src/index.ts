#!/usr/bin/env node

import sade from 'sade';
import chalk from 'chalk';
import execa from 'execa';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';
import logError from './logError';
import { installing, start } from './messages';
import { getAuthorName, safePackageName, setAuthorName } from './utils';
import { getInstallArgs, getInstallCmd } from './installation';
import { Input, Select } from 'enquirer';
import { templates } from './templates';
import { composePackageJson } from './templates/utils';
import { CliOptions } from './config';
import { MainPackageJson } from './types';
import pkg from '../package.json';

const prog = sade('re-space');
const templateOptions = Object.keys(templates);

prog
  .version(pkg.version)
  .command('create <pkg>')
  .describe('Create a new package')
  .example('create packageName')
  .option(
    '--template',
    `Specify a template. Allowed choices:
     
     [${templateOptions.join(', ')}]`
  )
  .example(`create --template ${templateOptions[0]} packageName`)
  .action(async (pkg: string, opts: CliOptions) => {
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
      } = (await fs.readJSON(packageJsonPath)) as MainPackageJson;
      const hasWorkspace = Array.isArray(workspaces) && workspaces.length > 0;

      if (!hasWorkspace || !isPackagePrivate) {
        throw new Error('Wrong location');
      }

      const slashNameIndex = name.indexOf('/');

      cliConfig.scope =
        slashNameIndex === -1 ? `@${name}` : name.slice(0, slashNameIndex);
      cliConfig.workspaces = workspaces[0];
    } catch (error) {
      console.log(
        chalk.red(`
      Can't find package.json.
      Make sure you run the script from the project root
      `)
      );
      process.exit(1);
    }

    console.log(
      chalk.magenta(`
    @re-space/cli
    `)
    );
    const bootSpinner = ora(`Creating ${chalk.bold.green(pkg)}...`);

    async function getProjectPath(projectPath: string): Promise<string> {
      const exists = await fs.pathExists(projectPath);

      if (!exists) {
        return projectPath;
      }

      bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
      const prompt = new Input({
        message: `A folder named ${chalk.bold.red(
          pkg
        )} already exists! ${chalk.bold('Choose a different name')}`,
        initial: pkg + '-copy',
        result: (v: string) => v.trim()
      });

      pkg = await prompt.run();
      projectPath = (await fs.realpath(process.cwd())) + '/' + pkg;
      bootSpinner.start(`Creating ${chalk.bold.green(pkg)}...`);
      return await getProjectPath(projectPath);
    }

    try {
      const realPath = await fs.realpath(process.cwd());
      const projectPath = await getProjectPath(
        `${realPath}/${cliConfig.workspaces}/${pkg}`
      );

      const prompt = new Select({
        message: 'Choose a template',
        choices: templateOptions
      });

      if (opts.template) {
        cliConfig.template = opts.template.trim();
        if (!prompt.choices.includes(cliConfig.template)) {
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
        path.resolve(__dirname, `../../templates/${cliConfig.template}`),
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
        templates[cliConfig.template as keyof typeof templates];
      const generatePackageJson = composePackageJson(templateConfig);

      // Install deps
      process.chdir(projectPath);
      const safeName = safePackageName(pkg);
      const packageJsonName = cliConfig.scope
        ? `${cliConfig.scope}/${safeName}`
        : safeName;
      const pkgJson = generatePackageJson({ name: packageJsonName, author });
      await fs.outputJSON(path.resolve(projectPath, 'package.json'), pkgJson);
      bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);
      await start(pkg);
    } catch (error) {
      bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
      logError(error);
      process.exit(1);
    }

    const templateConfig =
      templates[cliConfig.template as keyof typeof templates];
    const { dependencies: deps } = templateConfig;

    const installSpinner = ora(installing(deps.sort())).start();
    try {
      const cmd = await getInstallCmd();
      await execa('npx sort-package-json');
      await execa(cmd, getInstallArgs(cmd, deps));
      installSpinner.succeed('Installed dependencies');
    } catch (error) {
      installSpinner.fail('Failed to install dependencies');
      logError(error);
      process.exit(1);
    }
  });

prog.parse(process.argv);
