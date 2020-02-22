import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript2 from 'rollup-plugin-typescript2';
import external from 'rollup-plugin-peer-deps-external';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

export const createRollupConfig = (pkg) => ({
  input: 'src/publicApi.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.main,
      format: 'cjs',
    },
  ],
  plugins: [
    external({ includeDependencies: true }),
    postcss({
      modules: true,
      plugins: [simplevars(), nested(), cssnano(), autoprefixer()],
      extensions: ['.css', '.scss', '.sass'],
      use: ['sass'],
    }),
    typescript2({
      clean: true,
    }),
    resolve({
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
      preferBuiltins: false,
      browser: true,
    }),
    commonjs({
      include: /\/node_modules\//,
    }),
    babel({
      babelrc: false,
      extensions: ['.js', 'jsx', '.ts', '.tsx'],
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],
        '@babel/preset-react',
      ],
      exclude: /\/node_modules\//,
    }),
  ],
});
