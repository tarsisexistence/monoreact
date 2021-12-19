import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import beep from '@rollup/plugin-beep';
import closure from '@ampproject/rollup-plugin-closure-compiler';
import esbuild from 'rollup-plugin-esbuild';
import progress from 'rollup-plugin-progress';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import packageJson from './package.json';

export default {
  input: 'src/bin/index.ts',
  output: [
    { file: 'dist/bundle.js', format: 'es', sourcemap: true },
    { file: 'dist/bundle.cjs', format: 'cjs', sourcemap: true }
  ],
  external: (({ dependencies = {}, peerDependencies = {}, devDependencies = {} }) => {
    const externals = [...Object.keys(dependencies), ...Object.keys(peerDependencies), ...Object.keys(devDependencies)];
    const externalsMap = new Map(externals.map(key => [key, key]));

    return id => externalsMap.has(id) || Boolean(externals.find(key => id.startsWith(`${key}/`)));
  })(packageJson),
  plugins: [
    beep(),
    progress({ clearLine: true }),
    json(),
    closure(),
    esbuild({
      include: /\.ts$/,
      exclude: /node_modules/,
      sourceMap: false,
      minify: true,
      target: 'es2017', // default, or 'es20XX', 'esnext'
      tsconfig: 'tsconfig.json', // default
      // Add extra loaders
      loaders: {
        // Add .json files support
        // require @rollup/plugin-commonjs
        '.json': 'json'
      }
    }),
    commonjs({ include: /\/node_modules\//, sourceMaps: false }),
    nodeResolve({
      extensions: ['.js', '.ts'],
      preferBuiltins: true,
      browser: false
    }),
    globals(),
    builtins()
  ]
};
