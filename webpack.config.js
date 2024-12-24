const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {getBuildableComponents} = require('@google/dscc-scripts/build/viz/util');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const components = getBuildableComponents();
const componentIndexToBuild = Number(process.env.WORKING_COMPONENT_INDEX) || 0;
const component = components[componentIndexToBuild];

//console.log(`Building ${component.tsFile || component.jsFile}...`);

if (!component) {
  throw new Error('No component found at index ' + componentIndexToBuild);
}

const cssFilePath = path.resolve(__dirname, 'src', component.cssFile || '');
const jsFilePath = path.resolve(__dirname, 'src', component.jsFile || '');

const plugins = [
  // Add DSCC_IS_LOCAL definition
  new webpack.DefinePlugin({
    DSCC_IS_LOCAL: 'true',
  }),
  new BundleAnalyzerPlugin(),
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/
  }),
  new webpack.IgnorePlugin({
    resourceRegExp: /^(ansi-colors|log-utils|handlebars-helpers\/lib\/logging)$/
  }),
  new webpack.ids.HashedModuleIdsPlugin(), // 안정적인 모듈 ID 생성
  new webpack.ProvidePlugin({
    process: 'process/browser'
  }),
];

let body = '<script src="main.js"></script>';
if (fs.existsSync(cssFilePath)) {
  body = body + '\n<link rel="stylesheet" href="index.css">';
  plugins.push(new CopyWebpackPlugin({
    patterns: [
      { from: cssFilePath, to: '.' }
    ]
  }));
}

const iframeHTML = `<!doctype html> <html><body> ${body} </body></html>`;

fs.writeFileSync(path.resolve(__dirname, 'dist', 'vizframe.html'), iframeHTML);

console.log(process.env.NODE_ENV);

let config_mode;
if (process.env.NODE_ENV === 'development') {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  config_mode = {
    mode: 'development',
    devtool: 'source-map',
    optimization: {
      minimize: false,
    }
  };
} else {
  config_mode = {
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      ],
    }
  }
}

module.exports = [{
  ...config_mode,
  entry: jsFilePath,
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
    hot: true,
    open: true,
  },
  output: {
    filename: 'main.js', 
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.jsx'],
    mainFields: ['browser', 'module', 'main'],
    alias: {
      'ansi-colors': false,
      'log-utils': false, 
      'handlebars-helpers/lib/logging': false
    },
    fallback: {
      "url": require.resolve("url/"),
      "path": require.resolve("path-browserify"),
      "util": require.resolve("util/"),
      "process": require.resolve('process/browser'),
    }
  }
}];