const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(env) {
  env = env || {};
  const src = !env.p;
  const plugins = [];
  plugins.push(new webpack.DefinePlugin({
        isProdMode: JSON.stringify(src),
      }),
  );

  if (!src) {
    plugins.push(new UglifyJsPlugin());
  }

  const reactExternals = {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  };

  const externals = [reactExternals];

  return {
    entry: {
      index: ['./src/index.js'],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
        },
        {
          test: /\.jsx$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react', 'stage-2'],
              plugins: ['add-module-exports'],
            },
          },
        },
      ],
    },
    mode: 'production',
    plugins: plugins,
    externals: externals,
    resolve: {
      modules: [
        'node_modules',
      ],
    },
    output: {
      filename: 'bundle.min.js',
      libraryTarget: 'umd',
      library: '[name]',
    },
  };
};
