const commonPaths = require("./common-paths");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * 
 * @param {string} dir 
 */
function resolve (dir) {
    return path.join(__dirname, "..", dir)
}

const config = {
    entry: "./src/main/js/",
    output: {
        filename: "bundle.js",
        path: commonPaths.outputPath
    },
    resolve: {
        alias: {
            "@": resolve("src/main/js/")
        },
        extensions: [".js", ".json"]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin()
    ]
}

module.exports = config;