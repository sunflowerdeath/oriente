const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    entry: {
        main: ['./src/index.js'],
        'popup-demo': ['./src/PopupDemo.js']
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
        // publicPath: isProduction ? '/oriente' : '/'
        publicPath: '/'
    },
    mode: isProduction ? 'production' : 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                include: [path.resolve(__dirname, 'src')],
                use: [
                    {
                        loader: 'babel-loader',
                        options: { cacheDirectory: true }
                    }
                ]
            },
            {
                test: /\.md$/,
                use: [
                    { loader: 'babel-loader' },
                    {
                        loader: 'minimark-loader',
                        options: require('minibook/minimark-preset')
                    }
                ]
            }
        ]
    },
    devtool: isProduction ? 'cheap-module-source-map' : undefined,
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            filename: 'demo/popup.html',
            template: './src/index.html',
            chunks: ['popup-demo']
        }),
        // new BundleAnalyzerPlugin()
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'common',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        }
    },
    devServer: {
        port: 1337,
        host: '0.0.0.0',
        historyApiFallback: true
    },
    cache: {
        type: 'filesystem'
    }
}
