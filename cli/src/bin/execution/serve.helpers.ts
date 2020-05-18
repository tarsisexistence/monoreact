import { watch } from 'rollup';

import { cleanDistFolder, clearConsole, logError } from '../../shared/utils';
import { serveMessage } from '../../shared/messages';
import { createBuildConfig } from './configs/build.config';
import { readPackageJson, readTsconfigJson } from '../../shared/utils/fs.utils';

export const serveWorkspace = async (dir: string): Promise<any> => {
  const packageJson = await readPackageJson<CLI.Package.WorkspacePackageJSON>(
    dir
  );
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
  return new Promise(resolve => {
    watch(buildConfig).on('event', async event => {
      if (event.code === 'BUNDLE_START') {
        clearConsole();
        console.log(serveMessage.introduce());
        console.log(serveMessage.bundles(packageJson));
        console.log(serveMessage.compiling());
      }
      if (event.code === 'ERROR') {
        console.log(serveMessage.failed());
        logError(event.error);
      }

      if (event.code === 'BUNDLE_END') {
        console.log(serveMessage.compiled(isFirstChange));
        console.log(
          serveMessage.bundled({
            isFirstChange,
            module: packageJson.module,
            duration: event.duration
          })
        );
      }

      if (event.code === 'END') {
        isFirstChange = false;
        console.log(serveMessage.watching());
        resolve();
      }
    });
  });
};
