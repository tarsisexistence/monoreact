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
import postcss from 'rollup-plugin-postcss';
import stripCode from 'rollup-plugin-strip-code';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import { eslint } from 'rollup-plugin-eslint';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';

import { TsconfigJSON } from '../../../typings/tsconfig';
import { getExternalScreen } from '../../../shared/utils';

export const createBuildConfig = ({
  packageJson,
  runEslint,
  displayFilesize,
  useClosure
}: {
  displayFilesize: boolean;
  useClosure: boolean;
  runEslint: boolean;
  packageJson: CLI.Package.WorkspacePackageJSON;
  tsconfigJson: TsconfigJSON;
}): InputOptions & { output: OutputOptions } => {
  const externalScreen = getExternalScreen(packageJson);

  return {
    input: packageJson.source,
    output: {
      file: packageJson.module,
      format: 'es',
      sourcemap: true
    },
    external: externalScreen,
    plugins: [
      beep(),
      progress({ clearLine: true }),
      runEslint && eslint(),
      displayFilesize && filesize(),
      useClosure && closure(),
      json(),
      url(),
      image(),
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
          exclude: [
            '**/*.spec.ts',
            '**/*.test.ts',
            '**/*.spec.tsx',
            '**/*.test.tsx',
            'node_modules',
            'dist'
          ],
          compilerOptions: {
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
        start_comment: 'placeholder:start',
        end_comment: 'placeholder:end'
      })
    ]
  };
};
