import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'cjs',
    },
    {
      file: 'dist/bundle.min.js',
      format: 'cjs',
      name: 'version',
      plugins: [terser()],
    },
  ],
  external: [
    'react',
    'react-dom',
    'react-proptypes',
  ],
  plugins: [
    postcss({
      modules: true,
      plugins: [
        simplevars(),
        nested(),
        cssnext({ warnForDuplicates: false }),
        cssnano(),
      ],
      extensions: ['.css'],
    }),
    json(),
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
