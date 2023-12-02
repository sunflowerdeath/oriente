const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV === 'production'

const src = path.resolve(__dirname, 'src')

const rules = [
    {
        test: /\.(js|jsx)$/,
        include: [src],
        use: [
            {
                loader: 'esbuild-loader',
                options: { loader: 'jsx', jsx: 'automatic' }
            }
        ]
    },
    {
        test: /\.(ts|tsx)$/,
        include: [src],
        use: [
            {
                loader: 'esbuild-loader',
                options: { loader: 'tsx', jsx: 'automatic' }
            }
            // { loader: "ts-loader" },
        ]
    }
]

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
            ...rules,
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'esbuild-loader',
                        options: { loader: 'jsx', jsx: 'automatic' }
                    },
                    {
                        loader: 'minimark-loader',
                        options: {
                            gfm: true,
                            commonmark: true,
                            allowDangerousHTML: true
                        }
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
        })
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
