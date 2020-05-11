import fs from 'fs-extra';
import path from 'path';
import { Sade } from 'sade';
import { CLIEngine } from 'eslint';

import {
  findWorkspacePackageDir,
  findWorkspaceRootDir
} from '../../shared/utils';
import { createLintConfig } from '../../configs/lint.config';
import { LintMessages } from '../../shared/messages';
import {
  PACKAGE_JSON,
  TSCONFIG_JSON
} from '../../shared/constants/package.const';

export const lintBinCommand = (prog: Sade) => {
  prog
    .command('lint')
    .describe('Lint a package. (default lint pattern src/**/*.{js,jsx,ts,tsx}')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('l')
    .option('fix', 'Resolve fixable eslint errors')
    .example('lint --fix')
    .option('ignore-pattern', 'Ignore a pattern')
    .example('lint --ignore-pattern src/foo.ts')
    .action(async (opts: CLI.Options.Lint) => {
      const time = process.hrtime();
      const { linting, linted } = new LintMessages();
      const files = opts._.length > 0 ? opts._ : ['src/**/*.{js,jsx,ts,tsx}'];

      const rootDir = await findWorkspaceRootDir();
      let packageDir;

      try {
        packageDir = await findWorkspacePackageDir(true);
      } catch (e) {
        packageDir = rootDir;
      }

      const packageJsonPath = path.resolve(packageDir, PACKAGE_JSON);
      const { eslintConfig } = await fs.readJSON(packageJsonPath);
      const lintConfig = createLintConfig({
        dir: packageDir,
        isRoot: rootDir === packageDir
      });
      const cli = new CLIEngine({
        baseConfig: {
          ...lintConfig,
          ...(eslintConfig || {})
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fix: opts.fix,
        ignorePattern: opts['ignore-pattern'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
          tsconfigRootDir: packageDir,
          project: [
            path.resolve(rootDir, TSCONFIG_JSON),
            path.resolve(packageDir, TSCONFIG_JSON)
          ]
        }
      });

      console.log(linting(files));
      const report = cli.executeOnFiles(files);

      if (opts.fix) {
        CLIEngine.outputFixes(report);
      }

      console.log(cli.getFormatter()(report.results));

      const duration = process.hrtime(time);
      console.log(linted(duration));

      if (report.errorCount) {
        process.exit(1);
      }
    });
};
