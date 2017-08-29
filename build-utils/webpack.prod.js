const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const BabelMinifyWebpackPlugin = require("babel-minify-webpack-plugin");

const config = {
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.css/,
                use: ExtractTextWebpackPlugin.extract({
                    use: "css-loader",
                    fallback: "style-loader" // lazy loading as a fallback
                })
            }
        ]
    },
    plugins: [
        new ExtractTextWebpackPlugin("styles.css"),
        new BabelMinifyWebpackPlugin()
    ]
}

module.exports = config;
