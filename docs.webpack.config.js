const path = require('path')
const baseConfig = require('gnoll/config/webpack')
const babelConfig = require('gnoll/config/babel')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, {
    entry: {
        main: ['./src/docs/index.js'],
        'popup-demo': ['./src/docs/PopupDemo.js']
    },
    module: {
        rules: [
            {
                test: /\.md$/,
                use: [
                    { loader: 'babel-loader', options: babelConfig },
                    {
                        loader: 'minimark-loader',
                        options: require('minibook/minimark-preset')
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    { loader: 'babel-loader', options: babelConfig }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        extensions: [...baseConfig.resolve.extensions, '.ts', '.tsx']
    },
    devServer: {
        port: 1337,
        host: '0.0.0.0'
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
        })
    ]
})
