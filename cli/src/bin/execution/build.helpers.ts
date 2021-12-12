import { rollup } from 'rollup';

import { createBuildConfig } from './configs/build.config';
import { cleanDistFolder, logError } from '../../shared/utils';
import { buildMessage } from '../../shared/messages';
import { readPackageJson, readTsconfigJson } from '../../shared/utils';

export const buildPackages = async (dir: string): Promise<void> => {
  const tsconfigJson = await readTsconfigJson(dir);
  const packageJson = await readPackageJson<CLI.Package.PackagePackageJSON>(dir);
  await cleanDistFolder();

  const time = process.hrtime();
  const buildConfig = createBuildConfig({
    tsconfigJson,
    packageJson,
    displayFilesize: true,
    runEslint: false,
    useClosure: false
  });

  console.log(buildMessage.bundling(packageJson));

  try {
    const bundle = await rollup(buildConfig);
    await Promise.all(buildConfig.output.map(output => bundle.write(output)));
    const duration = process.hrtime(time);
    console.log(buildMessage.successful(duration));
  } catch (error) {
    logError(error as Error);
    process.exit(1);
  }
};
