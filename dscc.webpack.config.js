const createDsccConfig = (component, webpack, importer) => {
    const TerserPlugin = importer('terser-webpack-plugin');
    return [{
        module: {
        rules: [
            {
            test: /\.(js|jsx)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
        },
        plugins: [
        {
            apply: (compiler) => {
                const definePlugin = new webpack.DefinePlugin({
                    DSCC_IS_LOCAL: 'false',
                    'process.env': '{}',
                    'process.browser': true,
                });
                definePlugin.apply(compiler);
            },
            apply: (compiler) => {
                const providePlugin = new webpack.ProvidePlugin({
                    process: 'process/browser'
                });
                providePlugin.apply(compiler);
            }
        }
        ],
        resolve: {
            fallback: {
                "util": require.resolve("util/"),
                "process": require.resolve("process/browser"),
                "path": require.resolve("path-browserify"),
                "url": require.resolve("url/")
            }
        },
        optimization: {
            minimize: true,
            splitChunks: false,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true
                        }
                    }
                })
            ]
        }
    }];
};

module.exports = createDsccConfig;