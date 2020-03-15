import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import typescript2 from 'rollup-plugin-typescript2';
import external from 'rollup-plugin-peer-deps-external';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import closure from '@ampproject/rollup-plugin-closure-compiler';
import stripCode from 'rollup-plugin-strip-code';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import { eslint } from 'rollup-plugin-eslint';
// import analyze from 'rollup-plugin-analyzer' for production build
// import visualizer from 'rollup-plugin-visualizer'; for production build
// import { sizeSnapshot } from 'rollup-plugin-size-snapshot'; for production build

export const createRollupConfig = pkg => ({
  input: pkg.input,
  output: {
    file: pkg.module,
    format: 'es',
    sourcemap: true
  },
  plugins: [
    // sizeSnapshot(), for production build
    // analyze(), for production build
    // visualizer(), for production build
    progress({ clearLine: true }),
    filesize(),
    eslint(),
    closure(),
    json(),
    url(),
    image(),
    external({ includeDependencies: true }),
    typescript2({ clean: true }),
    commonjs({ include: /\/node_modules\// }),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: false,
      browser: true
    }),
    postcss({
      modules: true,
      plugins: [simplevars(), nested(), cssnano(), autoprefixer()],
      extensions: ['.css', '.scss', '.sass'],
      use: ['sass']
    }),
    babel({
      sourceMaps: true,
      inputSourceMap: true,
      babelrc: false,
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
      presets: ['@babel/preset-env', '@babel/preset-react'],
      exclude: /\/node_modules\//
    }),
    stripCode({
      start_comment: 'placeholder:start',
      end_comment: 'placeholder:end'
    })
  ]
});
