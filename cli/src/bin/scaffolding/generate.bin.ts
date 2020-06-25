import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import {
  getWorkspacePackageSetupPath,
  getWorkspacesFromDeclaration,
  logError,
  findWorkspaceRootDir
} from '../../shared/utils';
import { generateSetup } from './setup';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { generateMessage } from '../../shared/messages';
import {
  copyTemplate,
  createPackageJson,
  getAuthor,
  preventFolderCollisions,
  setNpmAuthorName,
  sortPackageJson
} from './scaffolding.helpers';
import {
  composePackageJson,
  getPackageTemplateType,
  buildPackage,
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
      const workspaceRoot = await findWorkspaceRootDir();
      const packageJsonPath = path.resolve(workspaceRoot, PACKAGE_JSON);
      const packageJson = (await fs.readJSON(packageJsonPath)) as CLI.Package.WorkspaceRootPackageJSON;
      const bootSpinner = ora(generateMessage.generating(pkgName));

      try {
        const workspacesInDeclaration = getWorkspacesFromDeclaration(packageJson.workspaces);
        const packageSetupPath = pathArg || getWorkspacePackageSetupPath(workspacesInDeclaration);
        // TODO: new algorithm of package name? get all names and prevent duplication
        packageName = await preventFolderCollisions({
          basePath: path.resolve(workspaceRoot, packageSetupPath),
          name: pkgName,
          onPromptMessage: (name: string) => generateMessage.failed(name),
          onPromptInitial: (name: string) => generateMessage.copy(name)
        });
        const packageDir = path.resolve(workspaceRoot, packageSetupPath, packageName);

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
        const packageJsonPreset: CLI.Package.WorkspacePackageJSON = composePackageJson({
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
      } catch (err) {
        bootSpinner.fail(generateMessage.failed(packageName));
        logError(err);
        process.exit(1);
      }

      const { dependencies } = generateSetup[packageTemplateType];
      const preparingSpinner = ora(generateMessage.preparingPackage(packageName, dependencies.sort())).start();

      try {
        await sortPackageJson();
        await buildPackage();
        preparingSpinner.succeed(generateMessage.successfulConfigure());
        console.log(generateMessage.preparedPackage(packageName));
      } catch (err) {
        preparingSpinner.fail(generateMessage.failedConfigure());
        logError(err);
        process.exit(1);
      }
    });
};
