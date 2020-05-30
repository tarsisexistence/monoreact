import fs from 'fs-extra';
import path from 'path';
import jest from 'jest';
import { Sade } from 'sade';

import { findWorkspacePackageDir } from '../../shared/utils';
import { createTestConfig } from './configs/test.config';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { getJestConfigOptions } from './test.helpers';

export const testBinCommand = (prog: Sade): void => {
  prog
    .command('test')
    .describe('Test a package')
    .alias('t')
    .option('config', 'Specify a path to the jest config')
    .action(async (opts: CLI.Options.Test) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      process.env.NODE_ENV = 'test';
      process.env.BABEL_ENV = 'test';

      const packageDir = await findWorkspacePackageDir();
      const packageJsonPath = path.resolve(packageDir, PACKAGE_JSON);
      const jestConfigOptions = await getJestConfigOptions(
        packageDir,
        opts.config
      );
      const { jest: jestPackageOptions } = await fs.readJSON(packageJsonPath);
      const testConfig = createTestConfig({
        rootDir: packageDir,
        jestPackageOptions,
        jestConfigOptions
      });
      jest.run([
        ...process.argv.slice(2),
        '--config',
        JSON.stringify({
          ...testConfig
        })
      ]);
    });
};
