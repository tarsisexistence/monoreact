import path from 'path';
import closure from '@ampproject/rollup-plugin-closure-compiler';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import beep from '@rollup/plugin-beep';
import babel from '@rollup/plugin-babel';
import { InputOptions, OutputOptions } from 'rollup';
import typescript2 from 'rollup-plugin-typescript2';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import stripCode from 'rollup-plugin-strip-code';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import { eslint } from 'rollup-plugin-eslint';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';

import { tsconfigJSON } from '../typings/tsconfig';

// TODO: index.d.ts is redundant here, remove later
// const tsconfigInclude = ['src', path.resolve(__dirname, '../../index.d.ts')];

export const createBuildConfig = (opts: {
  displayFilesize: boolean;
  useClosure: boolean;
  runEslint: boolean;
  packageJson: CLI.Package.WorkspacePackageJSON;
  tsconfigJson: tsconfigJSON;
}): InputOptions & { output: OutputOptions } => ({
  input: opts.packageJson.source,
  output: {
    file: opts.packageJson.module,
    format: 'es',
    sourcemap: true
  },
  plugins: [
    beep(),
    progress({ clearLine: true }),
    opts.runEslint && eslint(),
    opts.displayFilesize && filesize(),
    opts.useClosure && closure(),
    json(),
    url(),
    image(),
    external({ includeDependencies: true }),
    postcss({
      extract: false,
      modules: true,
      writeDefinitions: true,
      plugins: [
        simplevars({ variables: {} }),
        nested(),
        cssnano(),
        autoprefixer()
      ],
      extensions: ['.css', '.scss', '.sass'],
      use: ['sass']
    }),
    typescript2({
      clean: true,
      tsconfigDefaults: {
        // https://github.com/ezolenko/rollup-plugin-typescript2/issues/226 && checkTsConfig parsedConfig
        // TODO: refactor this code when this issue resolved
        // include:
        //   opts.tsconfigJson.include?.concat(...tsconfigInclude) ??
        //   tsconfigInclude,
        exclude: [
          '**/*.spec.ts',
          '**/*.test.ts',
          '**/*.spec.tsx',
          '**/*.test.tsx',
          'node_modules',
          'dist'
        ],
        compilerOptions: {
          baseUrl: './',
          rootDir: './src',
          sourceMap: true,
          declaration: true,
          jsx: 'react',
          target: 'es5',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          module: 'esnext',
          moduleResolution: 'node',
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true
        }
      }
    }),
    commonjs({ include: /\/node_modules\// }),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: false,
      browser: true
    }),
    babel({
      babelHelpers: 'runtime',
      skipPreflightCheck: true,
      babelrc: false,
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/proposal-class-properties'
      ],
      exclude: /\/node_modules\//
    }),
    stripCode({
      // eslint-disable-next-line @typescript-eslint/camelcase
      start_comment: 'placeholder:start',
      // eslint-disable-next-line @typescript-eslint/camelcase
      end_comment: 'placeholder:end'
    })
  ]
});
