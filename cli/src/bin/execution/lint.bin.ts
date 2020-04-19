import fs from 'fs-extra';
import path from 'path';
import { Sade } from 'sade';
import { CLIEngine } from 'eslint';

import {
  findWorkspacePackageDir,
  findWorkspaceRootDir
} from '../../helpers/utils/package.utils';
import {
  createLintConfig,
  createLintSettings
} from '../../configs/lint.config';
import { LintMessages } from '../../helpers/messages/lint.messages';

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
        packageDir = await findWorkspacePackageDir(false);
      } catch (e) {
        packageDir = rootDir;
      }

      const packageJsonPath = path.resolve(packageDir, 'package.json');
      const { eslintConfig } = await fs.readJSON(packageJsonPath);
      const lintConfig = createLintConfig();
      const settings = createLintSettings({
        dir: rootDir,
        isRoot: rootDir === packageDir
      });
      const cli = new CLIEngine({
        baseConfig: {
          ...lintConfig,
          ...(eslintConfig || {}),
          settings
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fix: opts.fix,
        ignorePattern: opts['ignore-pattern'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
          tsconfigRootDir: packageDir,
          project: [
            path.resolve(rootDir, 'tsconfig.json'),
            path.resolve(packageDir, 'tsconfig.json')
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
