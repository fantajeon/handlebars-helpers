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
];

let body = '<script src="main.js"></script>';
if (fs.existsSync(cssFilePath)) {
  body = body + '\n<link rel="stylesheet" href="index.css">';
  plugins.push(new CopyWebpackPlugin([{from: cssFilePath, to: '.'}]));
}

const iframeHTML = `
<!doctype html>
<html><body>
${body}
</body></html>
`;

fs.writeFileSync(path.resolve(__dirname, 'dist', 'vizframe.html'), iframeHTML);
module.exports = [{
  mode: 'production',
  entry: jsFilePath,
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/@mui'),
          path.resolve(__dirname, 'node_modules/@babel')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env', '@babel/preset-react' ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
              '@babel/plugin-proposal-private-methods',
              ["transform-imports", {
                "@mui/material": {
                  "transform": "@mui/material/${member}",
                  "preventFullImport": true
                },
                "@mui/icons-material": {
                  "transform": "@mui/icons-material/${member}",
                  "preventFullImport": true
                }
              }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
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
    //splitChunks: {
    //  chunks: 'all',
    //  minSize: 20000,
    //  maxSize: 244000,
    //  cacheGroups: {
    //    vendor: {
    //      test: /[\\/]node_modules[\\/]/,
    //      name: 'vendors',
    //      chunks: 'all',
    //    },
    //  },
    //},
  }
}];
