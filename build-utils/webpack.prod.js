const commonPaths = require("./common-paths");
const webpack = require("webpack");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const BabelMinifyWebpackPlugin = require("babel-minify-webpack-plugin");

const config = {
    devtool: "source-map",
    resolve: {
        alias: {
            "vue$": commonPaths.vueProd
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: "css-loader",
                    fallback: "style-loader" // lazy loading as a fallback
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: ["css-loader", "sass-loader"],
                    fallback: "style-loader" // lazy loading as a fallback
                })
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new ExtractTextWebpackPlugin("styles.css"),
        new BabelMinifyWebpackPlugin()
    ]
}

module.exports = config;
