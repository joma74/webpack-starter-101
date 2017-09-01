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
        extensions: [".ts", ".js", ".vue", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: "vue-loader",
                    options: {
                        loaders: {
                            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                            // the "scss" and "sass" values for the lang attribute to the right configs here.
                            // other preprocessors should work out of the box, no loader config like this necessary.
                            "scss": "vue-style-loader!css-loader!sass-loader",
                            "sass": "vue-style-loader!css-loader!sass-loader?indentedSyntax"
                        }
                    }
                }
            }
        ]
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
