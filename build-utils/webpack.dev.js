const config = {
    devtool: "eval-source-maps",
    module: {
        rules: [
            {
                test: /\.css/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    }
}

module.exports = config;