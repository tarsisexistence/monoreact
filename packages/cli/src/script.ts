#!/usr/bin/env node

import sade from 'sade';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import logError from './logError';
import path from 'path';
import execa from 'execa';
import shell from 'shelljs';
import ora from 'ora';
import semver from 'semver';
import * as Messages from './messages';
import { getNodeEngineRequirement, safePackageName } from './utils';
import getInstallCmd from './getInstallCmd';
import getInstallArgs from './getInstallArgs';
import { Input, Select } from 'enquirer';
import { templates } from './templates';
import { composePackageJson } from './templates/utils';

const pkg = require('../package.json');
const templateOptions = Object.keys(templates);

const prog = sade('re-space');

prog
  .version(pkg.version)
  .command('create <pkg>')
  .describe('Create a new package')
  .example('create mypackage')
  .option(
    '--template',
    `Specify a template. Allowed choices: [${templateOptions.join(', ')}]`
  )
  .example(`create --template ${templateOptions[0]} mypackage`)
  .action(async (pkg: string, opts: any) => {
    console.log(
      chalk.magenta(`
    @re-space/cli
    `)
    );
    const bootSpinner = ora(`Creating ${chalk.bold.green(pkg)}...`);
    let template;
    // Helper fn to prompt the user for a different
    // folder name if one already exists
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
        initial: pkg + '-1',
        result: (v: string) => v.trim()
      });

      pkg = await prompt.run();
      projectPath = (await fs.realpath(process.cwd())) + '/' + pkg;
      bootSpinner.start(`Creating ${chalk.bold.green(pkg)}...`);
      return await getProjectPath(projectPath); // recursion!
    }

    try {
      // get the project path
      const realPath = await fs.realpath(process.cwd());
      let projectPath = await getProjectPath(realPath + '/' + pkg);

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
      // copy the template
      await fs.copy(
        path.resolve(__dirname, `../templates/${template}`),
        projectPath,
        {
          overwrite: true
        }
      );

      // update license year and author
      let license: string = await fs.readFile(
        path.resolve(projectPath, 'LICENSE'),
        { encoding: 'utf-8' }
      );

      license = license.replace(/<year>/, `${new Date().getFullYear()}`);

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

      license = license.replace(/<author>/, author.trim());

      await fs.writeFile(path.resolve(projectPath, 'LICENSE'), license, {
        encoding: 'utf-8'
      });

      const templateConfig = templates[template as keyof typeof templates];
      const generatePackageJson = composePackageJson(templateConfig);

      // Install deps
      process.chdir(projectPath);
      const safeName = safePackageName(pkg);
      const pkgJson = generatePackageJson({ name: safeName, author });

      const nodeVersionReq = getNodeEngineRequirement(pkgJson);
      if (
        nodeVersionReq &&
        !semver.satisfies(process.version, nodeVersionReq)
      ) {
        bootSpinner.fail(Messages.incorrectNodeVersion(nodeVersionReq));
        process.exit(1);
      }

      await fs.outputJSON(path.resolve(projectPath, 'package.json'), pkgJson);
      bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);
      await Messages.start(pkg);
    } catch (error) {
      bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
      logError(error);
      process.exit(1);
    }

    const templateConfig = templates[template as keyof typeof templates];
    const { dependencies: deps } = templateConfig;

    const installSpinner = ora(Messages.installing(deps.sort())).start();
    try {
      const cmd = await getInstallCmd();
      await execa(cmd, getInstallArgs(cmd, deps));
      installSpinner.succeed('Installed dependencies');
      console.log(await Messages.start(pkg));
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
