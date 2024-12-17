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
                    DSCC_IS_LOCAL: 'false'
                });
                definePlugin.apply(compiler);
            }
        }
        ],
        optimization: {
            minimize: true,
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