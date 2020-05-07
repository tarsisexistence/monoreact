import { Sade } from 'sade';
import path from 'path';
import fs from 'fs-extra';
import { rollup } from 'rollup';

import { BuildMessages } from '../../shared/messages';
import { createBuildConfig } from '../../configs/build.config';
import { findWorkspacePackageDir, cleanDistFolder } from '../../shared/utils';
import { tsconfigJSON } from '../../typings/tsconfig';

export const buildBinCommand = (prog: Sade) => {
  prog
    .command('build')
    .describe('Build a package.')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('b')
    .example('build')
    .action(async () => {
      const time = process.hrtime();
      const { bundling, successful } = new BuildMessages();
      const packagePath = await findWorkspacePackageDir();
      const packageJsonPath = path.resolve(packagePath, 'package.json');
      const tsconfigJsonPath = path.resolve(packagePath, 'tsconfig.json');
      const packageJson = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspacePackageJSON;
      const tsconfigJson = (await fs.readJSON(
        tsconfigJsonPath
      )) as tsconfigJSON;
      const buildConfig = createBuildConfig({
        tsconfigJson,
        packageJson,
        displayFilesize: true,
        runEslint: true,
        useClosure: false
      });
      await cleanDistFolder();
      console.log(bundling(packageJson));
      const bundle = await rollup(buildConfig);
      await bundle.write(buildConfig.output);
      const duration = process.hrtime(time);
      console.log(successful(duration));
    });
};
