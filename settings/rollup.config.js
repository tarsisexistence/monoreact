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

export const createRollupConfig = pkg => ({
  input: pkg.input,
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
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
    })
  ]
});
