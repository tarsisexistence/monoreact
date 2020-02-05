import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
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
    'prop-types',
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
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
