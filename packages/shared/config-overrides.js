// process.env.NODE_ENV = 'development';

const fs = require('fs-extra');
const paths = require('react-scripts/config/paths');
const path = require('path');
// const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin'); // Require  html-webpack-plugin plugin
//
// module.exports = function override(config, env) {
//   config.entry = config.entry.filter(
//       entry => !entry.includes('webpackHotDevClient'));
//   config.output.publicPath = process.env.PUBLIC_URL;
//   // config.output.path = paths.appBuild;
//   paths.publicUrl = paths.appBuild + '/';
//   config.output.library = 'example';
//   config.output.libraryTarget = 'commonjs-module';
//
//   webpack(config).watch({
//     mode: 'development',
//     cache: false,
//     plugins: [  // Array of plugins to apply to build chunk
//       new HtmlWebpackPlugin({
//         template: '',
//       }),
//     ],
//   }, () => {
//   });
//
//   return config;
// };

const webpack = require('webpack');

module.exports = function override(config) {
  config.output.filename = 'static/js/[name].js';
  config.output.chunkFilename = 'static/js/[name].chunk.js';
  config.output.library = 'MyLib';
  config.output.libraryTarget = 'umd';
  config.output.umdNamedDefine = true;

  config.output.publicPath =   path.resolve(__dirname, 'dist')
  config.output.path = path.resolve(__dirname, 'dist');
  paths.publicUrl = path.resolve(__dirname, 'dist');

  console.log(config);

  webpack(config).watch({
    watchOptions: 3500,
  }, (err, stats) => {
    if (err) {
      console.error(err);
    }

    console.error(stats.toString({
      chunks: false,
      colors: true,
    }));
  });
  return config;
};
