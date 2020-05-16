import { Sade } from 'sade';
import path from 'path';
import fs from 'fs-extra';
import { rollup } from 'rollup';

import { buildMessage } from '../../shared/messages';
import { createBuildConfig } from '../../configs/build.config';
import { findWorkspacePackageDir, cleanDistFolder } from '../../shared/utils';
import { TsconfigJSON } from '../../typings/tsconfig';
import {
  PACKAGE_JSON,
  TSCONFIG_JSON
} from '../../shared/constants/package.const';

export const buildBinCommand = (prog: Sade) => {
  prog
    .command('build')
    .describe('Build a package.')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('b')
    .example('build')
    .action(async () => {
      const packagePath = await findWorkspacePackageDir();
      const packageJsonPath = path.resolve(packagePath, PACKAGE_JSON);
      const tsconfigJsonPath = path.resolve(packagePath, TSCONFIG_JSON);
      const packageJson = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspacePackageJSON;
      const tsconfigJson = (await fs.readJSON(
        tsconfigJsonPath
      )) as TsconfigJSON;

      const time = process.hrtime();
      const buildConfig = createBuildConfig({
        tsconfigJson,
        packageJson,
        displayFilesize: true,
        runEslint: true,
        useClosure: false
      });
      await cleanDistFolder();
      console.log(buildMessage.bundling(packageJson));
      const bundle = await rollup(buildConfig);
      await bundle.write(buildConfig.output);
      const duration = process.hrtime(time);
      console.log(buildMessage.successful(duration));
    });
};
