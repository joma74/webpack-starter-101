const config = {
    devtool: "eval-source-maps",
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