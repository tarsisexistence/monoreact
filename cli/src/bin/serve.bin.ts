import { Sade } from 'sade';
import path from 'path';
import fs from 'fs-extra';
import { watch } from 'rollup';

import { createBuildConfig } from '../configs/build.config';
import { cleanDistFolder, clearConsole } from '../helpers/utils/common.utils';
import { logError } from '../errors';
import { ServeMessages } from '../helpers/messages/serve.messages';

export const serveBinCommand = (prog: Sade) => {
  prog
    .command('serve', 'Rebuild package on change.', {
      // eslint-disable no-param-reassign

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      alias: ['s', 'start', 'w', 'watch']
    })
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
      const packagePath = process.cwd();
      const packageJsonPath = path.resolve(packagePath, 'package.json');
      const { source, module } = await fs.readJSON(packageJsonPath);
      const buildConfig = createBuildConfig({
        source,
        module,
        displayFilesize: false,
        useClosure: true
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
