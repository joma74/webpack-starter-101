const commonPaths = require("./common-paths");
const alias = require("./alias-common");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const config = {
    entry: "./src/main/js/",
    output: {
        filename: "bundle.js",
        path: commonPaths.outputPath
    },
    resolve: {
        alias: alias,
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
        }),
        new webpack.PrefetchPlugin("/dist/", "jsm@/utils/DecisionEngine.js"),
        new webpack.PrefetchPlugin("/dist/", "jsm@/utils/ramdautils.js"),
        new webpack.PrefetchPlugin("/dist/", "jsm@/components/twitterlike/TwitterLikeWithLabel.vue"),
        new webpack.PrefetchPlugin("/dist/", "css@/twitterlike.scss"),
        new webpack.PrefetchPlugin("/dist/", "~/ramda/es/addIndex.js"),
        new webpack.PrefetchPlugin("/dist/", "~/ramda/es/internal/_equals.js"),
        new webpack.PrefetchPlugin("/dist/", "~/ramda/es/toString.js"),
        new webpack.PrefetchPlugin("/dist/", "~/ramda/es/internal/_toString.js"),
        new webpack.PrefetchPlugin("/dist/", "~/ramda/es/compose.js"),
        new webpack.PrefetchPlugin("/dist/", "~/ramda/es/map.js"),
        new webpack.PrefetchPlugin("/dist/", "~/ramda/es/filter.js"),
        new webpack.PrefetchPlugin("/dist/", "~/ramda/es/reduce.js"),
        new webpack.PrefetchPlugin("/dist/", "~/ramda/es/tail.js"),
        new webpack.PrefetchPlugin("/dist/", "~/debug/src/browser.js"),
        new webpack.PrefetchPlugin("/dist/", "~/debug/src/debug.js"),
        new webpack.PrefetchPlugin("/dist/", "~/timers-browserify/main.js"),
        new webpack.PrefetchPlugin("/dist/", "~/curry-template/curry-template.js")
    ]
}

module.exports = config;
