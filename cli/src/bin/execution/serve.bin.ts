import { Sade } from 'sade';
import path from 'path';
import fs from 'fs-extra';
import { watch } from 'rollup';

import { ServeMessages } from '../../shared/messages';
import { createBuildConfig } from '../../configs/build.config';
import {
  cleanDistFolder,
  clearConsole,
  findWorkspacePackageDir,
  logError
} from '../../shared/utils';
import { TsconfigJSON } from '../../typings/tsconfig';
import {
  PACKAGE_JSON,
  TSCONFIG_JSON
} from '../../shared/constants/package.const';

export const serveBinCommand = (prog: Sade) => {
  prog
    .command('serve')
    .describe('Rebuild a package on change.')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('s', 'start', 'w', 'watch')
    .example('serve')
    .action(async () => {
      const {
        bundled,
        bundles,
        compiling,
        compiled,
        failed,
        introduce,
        watching
      } = new ServeMessages();
      const packagePath = await findWorkspacePackageDir();
      const packageJsonPath = path.resolve(packagePath, PACKAGE_JSON);
      const tsconfigJsonPath = path.resolve(packagePath, TSCONFIG_JSON);
      const packageJson = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspacePackageJSON;
      const tsconfigJson = (await fs.readJSON(
        tsconfigJsonPath
      )) as TsconfigJSON;
      const buildConfig = createBuildConfig({
        tsconfigJson,
        packageJson,
        displayFilesize: false,
        runEslint: false,
        useClosure: false
      });
      let isFirstChange = true;

      await cleanDistFolder();

      watch(buildConfig).on('event', async event => {
        if (event.code === 'BUNDLE_START') {
          clearConsole();
          console.log(introduce());
          console.log(bundles(packageJson));
          console.log(compiling());
        }
        if (event.code === 'ERROR') {
          console.log(failed());
          logError(event.error);
        }

        if (event.code === 'BUNDLE_END') {
          console.log(compiled(isFirstChange));
          console.log(
            bundled({
              isFirstChange,
              module: packageJson.module,
              duration: event.duration
            })
          );
          await event.result.write(buildConfig.output);
        }

        if (event.code === 'END') {
          isFirstChange = false;
          console.log(watching());
        }
      });
    });
};
