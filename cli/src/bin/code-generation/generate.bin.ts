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
  setAuthorName,
  sortPackageJson,
  info,
  logError,
  findWorkspaceRootDir
} from '../../shared/utils';
import { featureSetup, generateSetup, composePackageJson } from '../../setup';
import { GenerateMessages } from '../../shared/messages';
import { PACKAGE_JSON } from '../../shared/constants/package.const';

const templateOptions = Object.keys(generateSetup);
const featureOptions = Object.keys(featureSetup);

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
        successfulConfigure,
        failedConfigure,
        successful,
        copy,
        failed,
        generating,
        exists,
        invalidTemplate,
        preparedPackage,
        preparingPackage
      } = new GenerateMessages(packageName);
      let packageTemplateType: CLI.Setup.GenerateOptionType;
      const workspaceRoot = await findWorkspaceRootDir();
      const packageJsonPath = path.resolve(workspaceRoot, PACKAGE_JSON);
      const { name: rootName, workspaces, license } = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspaceRootPackageJSON;
      const workspacePackages = findWorkspacePackages(workspaces);
      const packageSetupPath = findPackageSetupPath(workspacePackages);
      const bootSpinner = ora(generating());

      async function getPackagePath(projectPath: string): Promise<string> {
        const isExist = await fs.pathExists(projectPath);

        if (!isExist) {
          return projectPath;
        }

        bootSpinner.fail(failed());
        const packageNamePrompt = new Input({
          message: exists(),
          initial: copy(),
          result: (v: string) => v.trim()
        });

        packageName = await packageNamePrompt.run();
        changePackageName(packageName);
        const nextProjectPath = `${workspaceRoot}/${packageSetupPath}/${packageName}`;
        return getPackagePath(nextProjectPath);
      }

      try {
        const projectPath = await getPackagePath(
          `${workspaceRoot}/${packageSetupPath}/${packageName}`
        );

        const prompt = new Select({
          message: 'Choose a template',
          choices: templateOptions.map(option => ({
            name: option,
            message: info(option)
          }))
        });

        if (template) {
          packageTemplateType = template.trim() as CLI.Setup.GenerateOptionType;

          if (
            !prompt.choices.find(
              (choice: any) => choice.name === packageTemplateType
            )
          ) {
            bootSpinner.fail(invalidTemplate(packageTemplateType));
            packageTemplateType = await prompt.run();
          }
        } else {
          packageTemplateType = await prompt.run();
        }

        bootSpinner.start();
        await fs.copy(
          path.resolve(
            __dirname,
            `../../../../templates/generate/${packageTemplateType}`
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
        const templateConfig = generateSetup[packageTemplateType];
        const generatePackageJson = composePackageJson(templateConfig);
        const pkgJson = generatePackageJson({
          author,
          name: packageName,
          rootName,
          license
        });
        await fs.outputJSON(path.resolve(projectPath, PACKAGE_JSON), pkgJson, {
          spaces: 2
        });
        bootSpinner.succeed(successful());
      } catch (err) {
        bootSpinner.fail(failed());
        logError(err);
        process.exit(1);
      }

      const { dependencies } = generateSetup[packageTemplateType];
      const preparingSpinner = ora(
        preparingPackage(dependencies.sort())
      ).start();

      try {
        await sortPackageJson();
        await buildPackage();
        preparingSpinner.succeed(successfulConfigure());
        console.log(await preparedPackage(packageName));
      } catch (err) {
        preparingSpinner.fail(failedConfigure());
        logError(err);
        process.exit(1);
      }
    });
};
