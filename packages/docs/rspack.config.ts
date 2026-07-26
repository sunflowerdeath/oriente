import path from "node:path"

import { defineConfig } from "@rspack/cli"
import { rspack } from "@rspack/core"

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProduction = process.env.NODE_ENV === "production"

const src = path.resolve(__dirname, "src")

const rules = [
    {
        test: /\.ts$/,
        include: [src],
        use: [
            {
                loader: "builtin:swc-loader",
                options: {
                    jsc: { parser: { syntax: "typescript" } },
                },
            },
        ],
    },
    {
        test: /\.tsx$/,
        include: [src],
        use: [
            {
                loader: "builtin:swc-loader",
                options: {
                    jsc: {
                        parser: { syntax: "typescript", jsx: true },
                        transform: { react: { runtime: "automatic" } },
                    },
                },
            },
        ],
    },
]

export default defineConfig({
    entry: {
        main: ["./src/index.tsx"],
        // 'popup-demo': ['./src/PopupDemo.tsx']
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "[name].js",
        // publicPath: isProduction ? '/oriente' : '/'
        publicPath: "/",
    },
    mode: isProduction ? "production" : "development",
    module: {
        rules: [
            ...rules,
            {
                test: /\.md$/,
                use: [
                    {
                        loader: "builtin:swc-loader",
                        options: {
                            jsc: {
                                parser: { syntax: "typescript", tsx: true },
                                transform: { react: { runtime: "automatic" } },
                            },
                        },
                    },
                    {
                        loader: "minimark-loader",
                        options: {
                            gfm: true,
                            commonmark: true,
                            allowDangerousHTML: true,
                        },
                    },
                ],
            },
        ],
    },
    devtool: isProduction ? "cheap-module-source-map" : undefined,
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    plugins: [
        new rspack.HtmlRspackPlugin({
            filename: "index.html",
            template: "./src/index.html",
            chunks: ["main"],
        }),
        new rspack.HtmlRspackPlugin({
            filename: "demo/popup.html",
            template: "./src/index.html",
            chunks: ["popup-demo"],
        }),
        // new BundleAnalyzerPlugin()
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "common",
                    chunks: "initial",
                    minChunks: 2,
                },
            },
        },
    },
    devServer: {
        port: 1337,
        host: "0.0.0.0",
        historyApiFallback: true,
    },
})
