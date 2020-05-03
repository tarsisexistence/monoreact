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
      const packageJsonPath = path.resolve(packagePath, 'package.json');
      const { source, module } = await fs.readJSON(packageJsonPath);
      const buildConfig = createBuildConfig({
        source,
        module,
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
          console.log(bundles({ source, module }));
          console.log(compiling());
        }
        if (event.code === 'ERROR') {
          console.log(failed());
          logError(event.error);
        }

        if (event.code === 'BUNDLE_END') {
          console.log(compiled(isFirstChange));
          console.log(
            bundled({ isFirstChange, module, duration: event.duration })
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
