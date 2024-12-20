const path = require('path')
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

const isProduction = process.env.NODE_ENV === 'production'
const src = path.resolve(__dirname, 'src')

const rules = [
    {
        test: /\.ts$/,
        include: [src],
        use: [
            {
                loader: 'builtin:swc-loader',
                options: {
                    jsc: { parser: { syntax: 'typescript' } }
                }
            }
        ]
    },
    {
        test: /\.tsx$/,
        include: [src],
        use: [
            {
                loader: 'builtin:swc-loader',
                options: {
                    jsc: {
                        parser: { syntax: 'typescript', jsx: true },
                        transform: { react: { runtime: 'automatic' } }
                    }
                }
            }
        ]
    }
]

const plugins = []
if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin())
}

module.exports = {
    entry: {
        main: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, './lib'),
        filename: '[name].js',
        library: {
            type: 'commonjs'
        }
    },
    mode: isProduction ? 'production' : 'development',
    module: { rules },
    devtool: 'cheap-module-source-map',
    externals: ['react', 'react-dom'],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    plugins,
    optimization: {
        minimize: false
    }
}
