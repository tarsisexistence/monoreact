#!/usr/bin/env node

import shell from 'shelljs';
import sade from 'sade';
import chalk from 'chalk';
import execa from 'execa';
import path from 'path';
import ora from 'ora';
import { copy, outputJSON, pathExists, realpath } from 'fs-extra';
import logError from './logError';
import { installing, start } from './messages';
import { safePackageName } from './utils';
import { getInstallArgs, getInstallCmd } from './installation';
import { Input, Select } from 'enquirer';
import { templates } from './templates';
import { composePackageJson } from './templates/utils';
import { CliOptions, getRespaceJson } from './config';
import pkg from '../package.json';

const prog = sade('re-space');
const templateOptions = Object.keys(templates);

prog
  .version(pkg.version)
  .command('create <pkg>')
  .describe('Create a new package')
  .example('create mypackage')
  .option(
    '--template',
    `Specify a template. Allowed choices:
     
     [${templateOptions.join(', ')}]`
  )
  .example(`create --template ${templateOptions[0]} mypackage`)
  .action(async (pkg: string, opts: CliOptions) => {
    const respaceConfig = await getRespaceJson(opts);
    console.log({ respaceConfig });
    console.log(
      chalk.magenta(`
    @re-space/cli
    `)
    );
    const bootSpinner = ora(`Creating ${chalk.bold.green(pkg)}...`);
    let template;

    async function getProjectPath(projectPath: string): Promise<string> {
      const exists = await pathExists(projectPath);

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
      projectPath = (await realpath(process.cwd())) + '/' + pkg;
      bootSpinner.start(`Creating ${chalk.bold.green(pkg)}...`);
      return await getProjectPath(projectPath);
    }

    try {
      const realPath = await realpath(process.cwd());
      const projectPath = await getProjectPath(
        `${realPath}/${respaceConfig.packages}/${pkg}`
      );

      const prompt = new Select({
        message: 'Choose a template',
        choices: templateOptions
      });

      if (opts.template) {
        template = opts.template.trim();
        if (!prompt.choices.includes(template)) {
          bootSpinner.fail(`Invalid template ${chalk.bold.red(template)}`);
          template = await prompt.run();
        }
      } else {
        template = await prompt.run();
      }

      bootSpinner.start();
      await copy(
        path.resolve(__dirname, `../../templates/${template}`),
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

      const templateConfig = templates[template as keyof typeof templates];
      const generatePackageJson = composePackageJson(templateConfig);

      // Install deps
      process.chdir(projectPath);
      const safeName = safePackageName(pkg);
      const packageJsonName = respaceConfig.scope
        ? `@${respaceConfig.scope}/${safeName}`
        : safeName;
      const pkgJson = generatePackageJson({ name: packageJsonName, author });
      await outputJSON(path.resolve(projectPath, 'package.json'), pkgJson);
      bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);
      await start(pkg);
    } catch (error) {
      bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
      logError(error);
      process.exit(1);
    }

    const templateConfig = templates[template as keyof typeof templates];
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

function getAuthorName() {
  let author = '';

  author = shell
    .exec('npm config get init-author-name', { silent: true })
    .stdout.trim();
  if (author) {
    return author;
  }

  author = shell.exec('git config user.name', { silent: true }).stdout.trim();
  if (author) {
    setAuthorName(author);
    return author;
  }

  author = shell
    .exec('npm config get init-author-email', { silent: true })
    .stdout.trim();
  if (author) {
    return author;
  }

  author = shell.exec('git config user.email', { silent: true }).stdout.trim();
  if (author) {
    return author;
  }

  return author;
}

function setAuthorName(author: string) {
  shell.exec(`npm config set init-author-name "${author}"`, { silent: true });
}

prog.parse(process.argv);
