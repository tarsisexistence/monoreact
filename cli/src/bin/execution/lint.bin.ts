import fs from 'fs-extra';
import path from 'path';
import { Sade } from 'sade';
import { ESLint } from 'eslint';

import { createLintConfig } from './configs/lint.config';
import { lintMessage } from '../../shared/messages';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { getPackageLintInfo } from './lint.helpers';

export const lintBinCommand = (prog: Sade): void => {
  prog
    .command('lint')
    .describe('Lint a package (default lint pattern src/**/*.{js,jsx,ts,tsx}.')
    .alias('l')
    .option('fix', 'Resolve fixable eslint errors')
    .example('lint --fix')
    .option('ignore-path', 'Ignore a path')
    .example('lint --ignore-path src/foo.ts')
    .action(async (opts: CLI.Options.Lint) => {
      const time = process.hrtime();
      const files = opts._.length > 0 ? opts._ : ['src/**/*.{js,jsx,ts,tsx}'];
      const { dir, project } = await getPackageLintInfo();
      const packageJsonPath = path.resolve(dir, PACKAGE_JSON);
      const { eslintConfig = {} } = await fs.readJSON(packageJsonPath);
      const cli = new ESLint({
        baseConfig: {
          ...createLintConfig(dir, project),
          ...eslintConfig
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fix: opts.fix,
        ignorePath: opts['ignore-path']
      });

      console.log(lintMessage.linting(files));
      const results = await cli.lintFiles(files);

      if (opts.fix) {
        await ESLint.outputFixes(results);
      }

      const formatter = await cli.loadFormatter();
      console.log(formatter.format(results));

      const duration = process.hrtime(time);
      console.log(lintMessage.linted(duration));

      for (const result of results) {
        if (result.errorCount) {
          process.exit(1);
        }
      }
    });
};
