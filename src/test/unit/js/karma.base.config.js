require("module-alias/register")
const alias_common = require("bu@/alias-common")
const alias_dev = require("bu@/alias-dev")
const webpack = require("webpack")

var webpackConfig = {
    resolve: {
        alias: Object.assign(alias_common, alias_dev)
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // loader: "babel-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: "\"development\""
            }
        })
    ],
    devtool: "#inline-source-map"
}

// 
/** 
 * shared config for all unit tests
 * @type {karma.ConfigOptions} 
 */
let karmaConfig = 
{
    frameworks: ["jasmine"],
    files: [
        "./index.js"
    ],
    preprocessors: {
        "./index.js": ["webpack", "sourcemap"]
    },
    webpack: webpackConfig,
    webpackMiddleware: {
        noInfo: true
    },
    plugins: [
        "karma-jasmine",
        "karma-jasmine-html-reporter",
        "karma-mocha-reporter",
        "karma-script-launcher",
        "karma-sourcemap-loader",
        "karma-webpack"
    ]
}

module.exports = karmaConfig;