const StatsWebpackPlugin = require("stats-webpack-plugin");

/**
 * See https://github.com/unindented/stats-webpack-plugin
 */
module.exports = {
    plugins: [
        /**
         * See https://webpack.js.org/configuration/stats/#stats for all options
         * Esp. Option colors MUST stay false for further analyzing
         */
        new StatsWebpackPlugin("webpack-stats.json", {
            source: false,
            colors: false,
            timings: true
        }, false)
    ]
}