import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import {
  getWorkspacePackageSetupPath,
  getWorkspacePackageDirs,
  logError,
  findWorkspaceRootDir
} from '../../shared/utils';
import { generateSetup } from './setup';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { composePackageJson, getPackageTemplateType } from './generate.helpers';
import { generateMessage } from '../../shared/messages';
import {
  buildPackage,
  copyTemplate,
  createPackageJson,
  getAuthor,
  getSafeName,
  setAuthorName,
  sortPackageJson
} from './scaffolding.helpers';

const templateOptions = Object.keys(generateSetup);

export const generateBinCommand = (prog: Sade): void => {
  prog
    .command('generate <pkg>')
    .describe('Generate a new package')
    .alias('g')
    .example('generate packageName')
    .option(
      't, template',
      `Specify a template.
     Available templates: [${templateOptions.join(', ')}]
     
     `
    )
    .example(`generate packageName --template ${templateOptions[0]}`)
    .action(async (pkgName: string, { template }: CLI.Options.Generate) => {
      let packageName = pkgName;
      let packageTemplateType = template;

      const workspaceRoot = await findWorkspaceRootDir();
      const packageJsonPath = path.resolve(workspaceRoot, PACKAGE_JSON);
      const { name: hostName, workspaces, license } = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspaceRootPackageJSON;
      const workspacePackages = getWorkspacePackageDirs(workspaces);
      const packageSetupPath = getWorkspacePackageSetupPath(workspacePackages);
      const bootSpinner = ora(generateMessage.generating(pkgName));

      try {
        const packageName = await getSafeName({
          basePath: path.resolve(`${workspaceRoot}/${packageSetupPath}`),
          name: pkgName,
          onFail: (name: string) => {
            bootSpinner.fail(generateMessage.failed(name));
          }
        });
        const packageDir = path.resolve(
          workspaceRoot,
          packageSetupPath,
          packageName
        );
        packageTemplateType = await getPackageTemplateType(template, () => {
          bootSpinner.fail(generateMessage.invalidTemplate(template));
        });

        bootSpinner.start();
        await copyTemplate({
          dir: packageDir,
          bin: 'generate',
          template: packageTemplateType
        });
        bootSpinner.stop();
        const author = await getAuthor();
        bootSpinner.start();
        setAuthorName(author);

        process.chdir(packageDir);
        const templateConfig = generateSetup[packageTemplateType];
        const packageJsonPreset: CLI.Package.WorkspacePackageJSON = composePackageJson(
          {
            author,
            name: packageName,
            license,
            hostName,
            template: templateConfig
          }
        );
        await createPackageJson({ dir: packageDir, preset: packageJsonPreset });
        bootSpinner.succeed(generateMessage.successful(packageName));
      } catch (err) {
        bootSpinner.fail(generateMessage.failed(packageName));
        logError(err);
        process.exit(1);
      }

      const { dependencies } = generateSetup[packageTemplateType];
      const preparingSpinner = ora(
        generateMessage.preparingPackage(packageName, dependencies.sort())
      ).start();

      try {
        await sortPackageJson();
        await buildPackage();
        preparingSpinner.succeed(generateMessage.successfulConfigure());
        console.log(await generateMessage.preparedPackage(packageName));
      } catch (err) {
        preparingSpinner.fail(generateMessage.failedConfigure());
        logError(err);
        process.exit(1);
      }
    });
};
