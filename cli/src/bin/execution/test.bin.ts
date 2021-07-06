import fs from 'fs-extra';
import path from 'path';
import { run } from 'jest';
import { Sade } from 'sade';

import { findPackageDirectory } from '../../shared/utils';
import { createTestConfig } from './configs/test.config';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { getJestConfigOptions, setTestNodeVariables } from './test.helpers';

export const testBinCommand = (prog: Sade): void => {
  prog
    .command('test')
    .describe('Test a package.')
    .alias('t')
    .option('config', 'Specify a path to the jest config')
    .action(async (opts: CLI.Options.Test) => {
      setTestNodeVariables();
      const packageDir = await findPackageDirectory();
      const packageJsonPath = path.resolve(packageDir, PACKAGE_JSON);
      const jestConfigOptions = await getJestConfigOptions(packageDir, opts.config);
      const { jest: jestPackageOptions } = await fs.readJSON(packageJsonPath);
      const testConfig = createTestConfig({
        rootDir: packageDir,
        jestPackageOptions,
        jestConfigOptions
      });
      run([
        ...process.argv.slice(3),
        '--config',
        JSON.stringify({
          ...testConfig
        })
      ]);
    });
};
