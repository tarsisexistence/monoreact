import { Sade } from 'sade';
import ora from 'ora';
import path from 'path';

import { installDependencies, logError, setNpmAuthorName } from '../../shared/utils';
import { copyTemplate, createPackageJson, getAuthor, sortPackageJson } from './scaffolding.helpers';
import { newSetup } from './setup/new';
import { newMessage } from '../../shared/messages';
import { resolveOptions } from './new.helpers';

const templateOptions = Object.keys(newSetup);

export const newBinCommand = (prog: Sade): void => {
  prog
    .command('new <name> [dir]')
    .describe(
      `Create a new project.
    Project name is required.
    Directory is optional. However, if you specify dir, then template files will be installed there, even if this folder already exists, but without overwriting.`
    )
    .example('new projectName')
    .example('new projectName .')
    .example('new projectName projectDirectory')
    .option(
      't, template',
      `Specify a template.
     Available templates: [${templateOptions.join(', ')}]
     
     `,
      'cra'
    )
    .example(`new projectName --template ${templateOptions[0]}`)
    .option('f, force', 'Skip folder checks', false)
    .action(async (name: string, dir: string | undefined, { template, force }: CLI.Options.New) => {
      const bootSpinner = ora();
      const initialDir = path.resolve(dir || name);
      const { projectDir, projectName } = force
        ? { projectDir: initialDir, projectName: name }
        : await resolveOptions({ name, dir: initialDir });
      bootSpinner.start(newMessage.creating(projectDir));

      try {
        // TODO: check if user chose the available option -> Error  ENOENT: no such file or directory, stat '/Users/xx/personal/monoreact/cli/templates/new/asd'
        await copyTemplate({ dir: projectDir, bin: 'new', template });
        bootSpinner.stop();
        const author = await getAuthor();
        setNpmAuthorName(author);
        bootSpinner.start();
        process.chdir(projectDir);
        const templateConfig = newSetup[template];
        const packageJsonPreset: CLI.Package.HostPackageJSON = {
          ...templateConfig.packageJson,
          name: projectName,
          author: author
        };
        await createPackageJson({
          dir: projectDir,
          preset: packageJsonPreset
        });
        bootSpinner.succeed(
          newMessage.created({
            dir: projectDir,
            name: projectName
          })
        );
      } catch (err) {
        bootSpinner.fail(newMessage.failed(projectName));
        logError(err);
        process.exit(1);
      }

      const preparingSpinner = ora(newMessage.preparing()).start();

      try {
        sortPackageJson();
        installDependencies();
        preparingSpinner.succeed(newMessage.prepared());
      } catch (err) {
        preparingSpinner.fail(newMessage.failedPreparation());
        logError(err);
      }

      console.log(newMessage.finish(projectDir));
    });
};
