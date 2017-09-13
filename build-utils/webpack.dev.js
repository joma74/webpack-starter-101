const commonPaths = require("./common-paths");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

const config = {
    devtool: "eval-source-maps",
    resolve: {
        alias: {
            "vue$": commonPaths.vueDev
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ "style-loader", {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                } ]
            },
            {
                test: /\.scss$/,
                use: [ "style-loader", {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                } ]
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    plugins: [
        new ExtractTextWebpackPlugin("styles.css")
    ]
}

module.exports = config;