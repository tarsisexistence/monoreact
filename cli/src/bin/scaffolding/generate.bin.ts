import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import {
  findHostDirectory,
  getNextPackageSetupPath,
  getPackagesFromDeclaration,
  logError,
  setNpmAuthorName
} from '../../shared/utils';
import { generateSetup } from './setup';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { generateMessage } from '../../shared/messages';
import {
  copyTemplate,
  createPackageJson,
  getAuthor,
  preventFolderCollisions,
  sortPackageJson
} from './scaffolding.helpers';
import {
  buildPackage,
  composePackageJson,
  getPackageTemplateType,
  updatePackageJsonWorkspacesDeclaration
} from './generate.helpers';

const templateOptions = Object.keys(generateSetup);

export const generateBinCommand = (prog: Sade): void => {
  prog
    .command('generate <pkg> [path]')
    .describe(
      `Generate a new package.
    Package name is required.
    Path is optional. The path argument indicates where the folder with the package name should be generated.`
    )
    .alias('g')
    .example('generate packageName')
    .example('generate packageName .')
    .example('generate packageName workspaces')
    .option(
      't, template',
      `Specify a template.
     Available templates: [${templateOptions.join(', ')}]
     
     `
    )
    .example(`generate packageName --template ${templateOptions[0]}`)
    .action(async (pkgName: string, pathArg: string | undefined, { template }: CLI.Options.Generate) => {
      let packageName = pkgName;
      let packageTemplateType = template;
      const rootDir = await findHostDirectory();
      const packageJsonPath = path.resolve(rootDir, PACKAGE_JSON);
      const packageJson = (await fs.readJSON(packageJsonPath)) as CLI.Package.HostPackageJSON;
      const bootSpinner = ora(generateMessage.generating(pkgName));

      try {
        const workspacesInDeclaration = getPackagesFromDeclaration(packageJson.workspaces);
        const packageSetupPath = pathArg || getNextPackageSetupPath(workspacesInDeclaration);
        // TODO: new algorithm of package name? get all names and prevent duplication
        packageName = await preventFolderCollisions({
          basePath: path.resolve(rootDir, packageSetupPath),
          name: pkgName,
          onPromptMessage: (name: string) => generateMessage.failed(name),
          onPromptInitial: (name: string) => generateMessage.copy(name)
        });
        const packageDir = path.resolve(rootDir, packageSetupPath, packageName);

        packageTemplateType = await getPackageTemplateType(template, () => {
          bootSpinner.fail(generateMessage.invalidTemplate(template));
        });

        const author = await getAuthor();
        bootSpinner.start();
        setNpmAuthorName(author);
        await copyTemplate({
          dir: packageDir,
          bin: 'generate',
          template: packageTemplateType
        });

        process.chdir(packageDir);
        const templateConfig = generateSetup[packageTemplateType];
        const packageJsonPreset: CLI.Package.PackagePackageJSON = composePackageJson({
          author,
          name: packageName,
          license: packageJson.license,
          hostName: packageJson.name,
          template: templateConfig
        });
        await createPackageJson({
          dir: packageDir,
          preset: packageJsonPreset
        });
        await updatePackageJsonWorkspacesDeclaration({
          packageJsonPath,
          packageJson,
          packageName,
          packages: workspacesInDeclaration,
          setupPath: packageSetupPath
        });
        bootSpinner.succeed(generateMessage.successful(packageName));
      } catch (error) {
        bootSpinner.fail(generateMessage.failed(packageName));
        logError(error as Error);
        process.exit(1);
      }

      const { dependencies } = generateSetup[packageTemplateType];
      const preparingSpinner = ora(generateMessage.preparingPackage(packageName, dependencies.sort())).start();

      try {
        await sortPackageJson();
        // TODO: doesn't log anything on error
        await buildPackage();
        preparingSpinner.succeed(generateMessage.successfulConfigure());
        console.log(generateMessage.preparedPackage(packageName));
      } catch (error) {
        preparingSpinner.fail(generateMessage.failedConfigure());
        logError(error as Error);
        process.exit(1);
      }
    });
};
