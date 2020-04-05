import { Sade } from 'sade';
import path from 'path';
import fs from 'fs-extra';
import { rollup } from 'rollup';

import { createBuildConfig } from '../configs/build.config';
import { cleanDistFolder } from '../helpers/utils/fs.utils';
import { highlight, success } from '../helpers/utils/color.utils';

export const buildBinCommand = (prog: Sade) => {
  prog
    .command('build', 'Build a package.', {
      // eslint-disable no-param-reassign

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      alias: ['b']
    })
    .example('build')
    .option('--watch', 'Run watch mode')
    .example(`build --watch`)
    .option('-w', 'Run watch mode')
    .example(`build -w`)
    .action(async (opts: CLI.BuildOptions) => {
      const time = process.hrtime();
      const packagePath = process.cwd();
      const packageJsonPath = path.resolve(packagePath, 'package.json');
      const { source, module } = await fs.readJSON(packageJsonPath);
      const buildConfig = createBuildConfig({
        source,
        module
      });
      await cleanDistFolder();
      const bundle = await rollup(buildConfig);
      await bundle.write(buildConfig.output);
      const [s, ms] = process.hrtime(time);
      console.log(
        success('Done in ') + highlight(`${s}.${ms.toString().slice(0, 3)}s.`)
      );
    });
};
