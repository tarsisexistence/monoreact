import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';
import { Input, Select } from 'enquirer';

import {
  buildPackage,
  findPackageSetupPath,
  findWorkspacePackages,
  getAuthorName,
  prettifyPackageJson,
  setAuthorName,
  sortPackageJson,
  error,
  info,
  logError
} from '../../shared/utils';
import { NoPackageJsonError, WrongWorkspaceError } from '../../shared/models';
import {
  featureTemplates,
  packageTemplates,
  composePackageJson
} from '../../setup';
import { GenerateMessages } from '../../shared/messages';
import { PACKAGE_JSON } from '../../shared/constants/package.const';

const templateOptions = Object.keys(packageTemplates);
const featureOptions = Object.keys(featureTemplates);

export const generateBinCommand = (prog: Sade) => {
  prog
    .command('generate <pkg>')
    .describe('Generate a new package.')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('g')
    .example('generate packageName')
    .option(
      't, template',
      `Specify a template.
     Available templates: [${templateOptions.join(', ')}]
     
     `
    )
    .example(`generate packageName --template ${templateOptions[0]}`)
    .option(
      'f, feature',
      `Specify a feature.
     Available features: [${featureOptions.join(', ')}]
     
     `
    )
    .example(`generate packageName --feature ${featureOptions[0]}`)
    .action(async (pkgName: string, { template }: CLI.Options.Generate) => {
      let packageName = pkgName;
      const {
        changePackageName,
        wrongWorkspace,
        successfulConfigure,
        failedConfigure,
        successful,
        copy,
        failed,
        script,
        generating,
        exists,
        invalidTemplate,
        preparedPackage,
        preparingPackage
      } = new GenerateMessages(packageName);
      const cliConfig: Record<string, any> = {
        template: null,
        workspaces: null,
        rootWorkspaceName: null,
        license: null
      };

      // TODO: refactor with findWorkspaceRootPath
      try {
        const currentPath = await fs.realpath(process.cwd());
        const packageJsonPath = path.resolve(currentPath, PACKAGE_JSON);

        const {
          name,
          workspaces,
          license,
          private: isPackagePrivate
        } = (await fs.readJSON(
          packageJsonPath
        )) as CLI.Package.WorkspaceRootPackageJSON;
        const workspacePackages = findWorkspacePackages(workspaces);
        const hasWorkspace = workspacePackages.length > 0;

        if (!hasWorkspace || !isPackagePrivate) {
          throw new WrongWorkspaceError(wrongWorkspace());
        }

        cliConfig.license = license;
        cliConfig.rootWorkspaceName = name;
        cliConfig.workspaces = findPackageSetupPath(workspacePackages);
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

      const bootSpinner = ora(generating());

      async function getProjectPath(projectPath: string): Promise<string> {
        const isExist = await fs.pathExists(projectPath);

        if (!isExist) {
          return projectPath;
        }

        console.log(projectPath);
        bootSpinner.fail(failed());
        const packageNamePrompt = new Input({
          message: exists(),
          initial: copy(),
          result: (v: string) => v.trim()
        });

        packageName = await packageNamePrompt.run();
        changePackageName(packageName);
        const nextProjectPath = `${await fs.realpath(process.cwd())}/${
          cliConfig.workspaces
        }${packageName}`;
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

        if (template) {
          cliConfig.template = template.trim();

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
            `../../../../templates/generate/${cliConfig.template}`
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
          packageTemplates[cliConfig.template as CLI.Template.GenerateType];
        const generatePackageJson = composePackageJson(templateConfig);
        const pkgJson = generatePackageJson({
          author,
          name: packageName,
          rootName: cliConfig.rootWorkspaceName,
          license: cliConfig.license
        });
        await fs.outputJSON(path.resolve(projectPath, PACKAGE_JSON), pkgJson);
        bootSpinner.succeed(successful());
      } catch (err) {
        bootSpinner.fail(failed());
        logError(err);
        process.exit(1);
      }

      const { dependencies } = packageTemplates[
        cliConfig.template as CLI.Template.GenerateType
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
