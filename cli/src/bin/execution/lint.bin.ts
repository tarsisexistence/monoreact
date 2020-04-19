import fs from 'fs-extra';
import path from 'path';
import { Sade } from 'sade';
import { CLIEngine } from 'eslint';

import {
  findWorkspacePackageDir,
  findWorkspaceRootDir
} from '../../helpers/utils/package.utils';
import { createLintConfig } from '../../configs/lint.config';
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

      let packagePath;
      try {
        packagePath = await findWorkspacePackageDir();
      } catch (e) {
        console.log('asd');
        packagePath = await findWorkspaceRootDir();
      }

      const packageJsonPath = path.resolve(packagePath, 'package.json');
      const { eslintConfig } = await fs.readJSON(packageJsonPath);
      const lintConfig = createLintConfig();
      const cli = new CLIEngine({
        baseConfig: {
          ...lintConfig,
          ...(eslintConfig || {}),
          settings: {
            'import/resolver': {
              node: {
                paths: [path.resolve(packagePath, 'src')],
                extensions: ['.js', '.jsx', '.ts', '.tsx']
              }
            }
          }
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fix: opts.fix,
        ignorePattern: opts['ignore-pattern'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
          project: [
            path.resolve(packagePath, '../../settings/tsconfig.lint.json'),
            path.resolve(packagePath, 'tsconfig.json')
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
