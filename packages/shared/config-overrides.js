const webpack = require('webpack');
const paths = require('react-scripts/config/paths');

module.exports = function override(config, env) {
  const cssOptionId = config.plugins.findIndex(
      plugin => plugin.options && plugin.options.filename &&
          plugin.options.filename.includes('css'));

  if (cssOptionId !== -1) {
    config.plugins[cssOptionId].filename = 'static/css/[name].css';
    config.plugins[cssOptionId].chunkFilename = 'static/css/[name].css';
  }

  if (env === 'production') {
    config.output.filename = 'static/js/[name].js';
    config.output.chunkFilename = 'static/js/[name].chunk.js';
    // check does it work
    config.externals = [
      'react',
      'react-dom',
      '/^react\\/.+$/',
    ];
    // react: {
    //   commonjs: 'react',
    //   commonjs2: 'react',
    //   umd: 'react',
    //   root: 'react',
    // },
    // 'react-dom': {
    //   commonjs: 'react-dom',
    //   commonjs2: 'react-dom',
    //   umd: 'react-dom',
    //   root: 'react-dom'
    // },
  } else {
    paths.publicUrl = `${paths.appBuild}/`;
    config.output.publicPath = paths.publicUrl;

    config.entry = config.entry.filter(
        entry => !entry.includes('webpackHotDevClient'));
    config.output.publicPath = '/';

    webpack(config).watch({
      mode: 'development',
      cache: false,
    }, () => {
    });
  }

  config.output.library = 'omniaShared';
  config.output.libraryTarget = 'umd';
  config.output.umdNamedDefine = true;

  return config;
};
