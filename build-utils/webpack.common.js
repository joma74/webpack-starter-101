const commonPaths = require("./common-paths");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
    entry: "./src/main/js/",
    module: {
        rules: [
            {
                test: /\.(woff|png|jpg|gif)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10000
                    }
                }
            }
        ]
    },
    output: {
        filename: "bundle.js",
        path: commonPaths.outputPath
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin()
    ]
}

module.exports = config;