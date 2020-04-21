import { Sade } from 'sade';
import path from 'path';
import fs from 'fs-extra';
import { rollup } from 'rollup';

import { BuildMessages } from '../../shared/messages/build.messages';
import { createBuildConfig } from '../../configs/build.config';
import { cleanDistFolder } from '../../shared/utils';
import { findWorkspacePackageDir } from '../../shared/utils';

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
      const { source, module } = await fs.readJSON(packageJsonPath);
      const buildConfig = createBuildConfig({
        source,
        module,
        displayFilesize: true,
        useClosure: true
      });
      await cleanDistFolder();
      console.log(bundling({ source, module }));
      const bundle = await rollup(buildConfig);
      await bundle.write(buildConfig.output);
      const duration = process.hrtime(time);
      console.log(successful(duration));
    });
};
