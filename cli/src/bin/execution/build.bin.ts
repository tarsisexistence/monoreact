import { Sade } from 'sade';
import path from 'path';
import fs from 'fs-extra';
import { rollup } from 'rollup';

import { BuildMessages } from '../../helpers/messages/build.messages';
import { createBuildConfig } from '../../configs/build.config';
import { cleanDistFolder } from '../../helpers/utils/common.utils';

export const buildBinCommand = (prog: Sade) => {
  prog
    .command('build', 'Build a package.', {
      // eslint-disable no-param-reassign

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      alias: ['b']
    })
    .example('build')
    .action(async () => {
      const time = process.hrtime();
      const { bundling, successful } = new BuildMessages();
      const packagePath = process.cwd();
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
