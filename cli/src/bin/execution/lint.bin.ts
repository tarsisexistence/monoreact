import fs from 'fs-extra';
import path from 'path';
import { Sade } from 'sade';
import { CLIEngine } from 'eslint';

import { createLintConfig } from './configs/lint.config';
import { lintMessage } from '../../shared/messages';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { getPackageLintInfo } from './lint.helpers';

export const lintBinCommand = (prog: Sade): void => {
  prog
    .command('lint')
    .describe('Lint a package (default lint pattern src/**/*.{js,jsx,ts,tsx}')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('l')
    .option('fix', 'Resolve fixable eslint errors')
    .example('lint --fix')
    .option('ignore-pattern', 'Ignore a pattern')
    .example('lint --ignore-pattern src/foo.ts')
    .action(async (opts: CLI.Options.Lint) => {
      const time = process.hrtime();
      const files = opts._.length > 0 ? opts._ : ['src/**/*.{js,jsx,ts,tsx}'];
      const { dir, project } = await getPackageLintInfo();
      const packageJsonPath = path.resolve(dir, PACKAGE_JSON);
      const { eslintConfig = {} } = await fs.readJSON(packageJsonPath);
      const cli = new CLIEngine({
        baseConfig: {
          ...createLintConfig(dir),
          ...eslintConfig
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fix: opts.fix,
        ignorePattern: opts['ignore-pattern'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
          tsconfigRootDir: dir,
          project
        }
      });

      console.log(lintMessage.linting(files));
      const report = cli.executeOnFiles(files);

      if (opts.fix) {
        CLIEngine.outputFixes(report);
      }

      console.log(cli.getFormatter()(report.results));

      const duration = process.hrtime(time);
      console.log(lintMessage.linted(duration));

      if (report.errorCount) {
        process.exit(1);
      }
    });
};
