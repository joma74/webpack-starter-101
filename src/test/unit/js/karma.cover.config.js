const base = require("./karma.base.config")
const alias_common = require("bu@/alias-common")

/**
 * @param {karma.Config} config the karma config object 
 */
module.exports = function (config) {
    let options = Object.assign(base, {
        browsers: ["ChromeHeadless"],
        reporters: ["mocha", "coverage"],
        singleRun: true,
        autoWatch: false,
        logLevel: config.LOG_INFO,
        // optionally, configure the reporter
        coverageReporter: {
            includeAllSources: true,
            dir: "../../../../target/coverage/",
            instrumenterOptions: {
                istanbul: { noCompact: true }
            },
            reporters: [
                { type: "html", subdir: "html" },
                { type: "text-summary" }
            ]
        },
        plugins: base.plugins.concat([
            "karma-chrome-launcher",
            "karma-coverage"
        ])
    });
    options.webpack.module.rules[0] = {
        test: /\.js$/,
        use: {
            loader: "istanbul-instrumenter-loader", query: {
                esModules: true
            }
        },
        include: alias_common["jsm@"],
        exclude: /node_modules/
    }
    config.set(options);
}