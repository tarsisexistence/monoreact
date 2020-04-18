import fs from 'fs-extra';
import path from 'path';
import jest from 'jest';
import { Sade } from 'sade';

import { findWorkspacePackagePath } from '../../helpers/utils/package.utils';
import { createTestConfig } from '../../configs/test.config';

export const testBinCommand = (prog: Sade) => {
  prog
    .command('test')
    .describe('Test a package.')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('t')
    .option('config', 'Specify a path to the jest config')
    .action(async (opts: CLI.Options.Test) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      process.env.NODE_ENV = 'test';
      process.env.BABEL_ENV = 'test';

      const packagePath = await findWorkspacePackagePath();
      const packageJsonPath = path.resolve(packagePath, 'package.json');

      let jestConfigOptions;

      try {
        if (opts.config) {
          const jestConfigPathOption = path.resolve(packagePath, opts.config);
          // const isSpecifiedConfigExists = fs.existsSync(jestConfigPathOption);
          for (let i = 0; i < process.argv.length; i += 1) {
            if (process.argv[i] === '--config') {
              process.argv = process.argv
                .slice(0, i)
                .concat(process.argv.slice(i + 2));
              break;
            }
          }
          const filenameSegments = opts.config.split('.');
          const isJavaScript =
            filenameSegments[filenameSegments.length - 1] === 'JS';
          jestConfigOptions = isJavaScript
            ? // eslint-disable-next-line global-require,import/no-dynamic-require
              require(jestConfigPathOption)
            : await fs.readJSON(jestConfigPathOption);
        } else {
          const JEST_CONFIG = 'jest.config';
          const jestConfigPathJS = path.resolve(
            packagePath,
            `${JEST_CONFIG}.js`
          );
          const jestConfigPathJSON = path.resolve(
            packagePath,
            `${JEST_CONFIG}.json`
          );
          if (fs.existsSync(jestConfigPathJS)) {
            // eslint-disable-next-line global-require,import/no-dynamic-require
            jestConfigOptions = require(jestConfigPathJS);
          } else if (fs.existsSync(jestConfigPathJSON)) {
            jestConfigOptions = await fs.readJSON(jestConfigPathJSON);
          } else {
            jestConfigOptions = {};
          }
        }

        // eslint-disable-next-line no-empty
      } catch {}
      const { jest: jestPackageOptions } = await fs.readJSON(packageJsonPath);
      const testConfig = createTestConfig({
        rootDir: packagePath,
        jestPackageOptions,
        jestConfigOptions
      });
      const jestArgs = [
        ...process.argv.slice(2),
        '--config',
        JSON.stringify({
          ...testConfig
        })
      ];
      jest.run(jestArgs);
    });
};
