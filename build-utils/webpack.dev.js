const commonPaths = require("./common-paths");

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
                use: [ "style-loader", "css-loader" ]
            },
            {
                test: /\.scss$/,
                use: [ "style-loader", "css-loader", "sass-loader" ]
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    }
}

module.exports = config;