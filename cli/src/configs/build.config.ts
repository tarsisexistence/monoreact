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

export const createBuildConfig = (opts: {
  source: string;
  module: string;
  displayFilesize: boolean;
  useClosure: boolean;
  runEslint: boolean;
}): InputOptions & { output: OutputOptions } => ({
  input: opts.source,
  output: {
    file: opts.module,
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
      modules: true,
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
        include: [path.resolve(__dirname, 'styles.d.ts')],
      tsconfigDefaults: {
        exclude: [
          '**/*.spec.ts',
          '**/*.test.ts',
          '**/*.spec.tsx',
          '**/*.test.tsx',
          'node_modules',
          'dist'
        ],
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          jsx: 'react'
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
