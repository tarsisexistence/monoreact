import { watch } from 'rollup';

import { cleanDistFolder, clearConsole, logError } from '../../shared/utils';
import { watchMessage } from '../../shared/messages';
import { createBuildConfig } from './configs/build.config';
import { readPackageJson, readTsconfigJson } from '../../shared/utils/fs.utils';

export const watchPackages = async (dir: string): Promise<any> => {
  const packageJson = await readPackageJson<CLI.Package.PackagePackageJSON>(dir);
  const tsconfigJson = await readTsconfigJson(dir);

  const buildConfig = createBuildConfig({
    tsconfigJson,
    packageJson,
    displayFilesize: false,
    runEslint: false,
    useClosure: false
  });
  let isFirstChange = true;

  await cleanDistFolder();
  return new Promise<void>(resolve => {
    watch(buildConfig).on('event', async event => {
      if (event.code === 'BUNDLE_START') {
        clearConsole();
        console.log(watchMessage.introduce());
        console.log(watchMessage.bundles(packageJson));
        console.log(watchMessage.compiling());
      }
      if (event.code === 'ERROR') {
        console.log(watchMessage.failed());
        logError(event.error);
      }

      if (event.code === 'BUNDLE_END') {
        console.log(watchMessage.compiled(isFirstChange));
        console.log(
          watchMessage.bundled({
            isFirstChange,
            module: packageJson.module,
            duration: event.duration
          })
        );
      }

      if (event.code === 'END') {
        isFirstChange = false;
        console.log(watchMessage.watching());
        resolve();
      }
    });
  });
};
