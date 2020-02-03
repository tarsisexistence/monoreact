const webpack = require('webpack');
const paths = require('react-scripts/config/paths');

const reactExternals = {
  react: {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
  },
  'react-dom': {
    root: 'ReactDOM',
    commonjs2: 'react-dom',
    commonjs: 'react-dom',
    amd: 'react-dom'
  }
};

module.exports = function override(config, env) {
  if (env === 'production') {
    const cssOptionId = config.plugins.findIndex(
        plugin => plugin.options && plugin.options.filename &&
            plugin.options.filename.includes('css'));

    if (cssOptionId !== -1) {
      config.plugins[cssOptionId].options.filename = 'static/css/[name].css';
      config.plugins[cssOptionId].options.chunkFilename = 'static/css/[name].css';
    }
    config.output.filename = 'static/js/[name].js';
    config.output.chunkFilename = 'static/js/[name].chunk.js';
    // check does it work
    config.externals = [
      'react',
      'react-dom',
      '/^react\\/.+$/',
    ];
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

  config.output.library = 'sharedLib';
  config.output.libraryTarget = 'umd';
  config.output.umdNamedDefine = true;

  return config;
};
