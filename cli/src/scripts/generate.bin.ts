import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';
import { Input, Select } from 'enquirer';

import { logError, WrongWorkspaceError, NoPackageJsonError } from '../errors';
import {
  buildPackage,
  findWorkspacePackages,
  getAuthorName,
  prettifyPackageJson,
  setAuthorName,
  sortPackageJson
} from '../helpers/utils';
import { featureTemplates, packageTemplates } from '../setup';
import { composePackageJson } from '../setup/package/utils';
import { PACKAGE_JSON } from '../helpers/constants';
import { PackageMessages } from '../helpers/messages/package';
import { error, info } from '../helpers/messages/colors';
import { TITLE_CLI } from '../helpers/messages/common';

const templateOptions = Object.keys(packageTemplates);
const featureOptions = Object.keys(featureTemplates);

export const generateBinCommand = (prog: Sade) => {
  prog
    .command('generate <pkg>', 'Generate a new package', {
      // eslint-disable no-param-reassign

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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
    .action(async (packageName: string, opts: CLI.Options) => {
      const {
        wrongWorkspace,
        successfulConfigure,
        failedConfigure,
        success,
        copy,
        failed,
        script,
        generating,
        exists,
        invalidTemplate,
        preparedPackage,
        preparingPackage
      } = new PackageMessages(packageName);
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
        } = (await fs.readJSON(packageJsonPath)) as CLI.Package.RootPackageJSON;
        const workspacePackages = findWorkspacePackages(workspaces);
        const hasWorkspace = workspacePackages.length > 0;

        if (!hasWorkspace || !isPackagePrivate) {
          throw new WrongWorkspaceError(wrongWorkspace());
        }

        cliConfig.license = license;
        cliConfig.rootWorkspaceName = name;
        cliConfig.workspaces = workspacePackages[0].replace('*', '');
      } catch (err) {
        if (err.isWrongWorkspace) {
          console.log(error(err));
        } else {
          console.log(
            error((new NoPackageJsonError(script()) as unknown) as any)
          );
          logError(err);
        }

        process.exit(1);
      }

      console.log(TITLE_CLI);
      const bootSpinner = ora(generating());

      async function getProjectPath(projectPath: string): Promise<string> {
        const isExist = await fs.pathExists(projectPath);

        if (!isExist) {
          return projectPath;
        }

        console.log(projectPath);
        bootSpinner.fail(failed());
        const prompt = new Input({
          message: exists(),
          initial: copy(),
          result: (v: string) => v.trim()
        });

        const nextPackageName = await prompt.run();
        const nextProjectPath = `${await fs.realpath(process.cwd())}/${
          cliConfig.workspaces
        }${nextPackageName}`;
        return getProjectPath(nextProjectPath);
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
            message: info(option)
          }))
        });

        if (opts.template) {
          cliConfig.template = opts.template.trim();

          if (
            !prompt.choices.find(
              (choice: any) => choice.name === cliConfig.template
            )
          ) {
            bootSpinner.fail(invalidTemplate(cliConfig.template));
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
          packageTemplates[cliConfig.template as CLI.Template.Package];
        const generatePackageJson = composePackageJson(templateConfig);
        const pkgJson = generatePackageJson({
          author,
          name: packageName,
          rootName: cliConfig.rootWorkspaceName,
          license: cliConfig.license
        });
        await fs.outputJSON(path.resolve(projectPath, PACKAGE_JSON), pkgJson);
        bootSpinner.succeed(success());
      } catch (err) {
        bootSpinner.fail(failed());
        logError(err);
        process.exit(1);
      }

      const { dependencies } = packageTemplates[
        cliConfig.template as CLI.Template.Package
      ];
      const installSpinner = ora(preparingPackage(dependencies.sort())).start();

      try {
        await sortPackageJson();
        await prettifyPackageJson();
        await buildPackage();
        installSpinner.succeed(successfulConfigure());
        console.log(await preparedPackage(packageName));
      } catch (err) {
        installSpinner.fail(failedConfigure());
        logError(err);
        process.exit(1);
      }
    });
};
