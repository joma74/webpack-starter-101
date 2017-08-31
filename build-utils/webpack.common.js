const commonPaths = require("./common-paths");
// const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
    entry: "./src/main/js/",
    output: {
        filename: "bundle.js",
        path: commonPaths.outputPath
    },
    resolve: {
        alias: {
            "js@": commonPaths.mainJs,
            "css@": commonPaths.mainCss,
            "html@": commonPaths.mainHtml,
            "vue$": commonPaths.vueEsm
        },
        extensions: [".js", ".json"]
    },
    plugins: [
        //new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            title: "Webpack Vue Starter 101",
            template: "src/main/html/twitterlike.ejs"
        })
    ]
}

module.exports = config;