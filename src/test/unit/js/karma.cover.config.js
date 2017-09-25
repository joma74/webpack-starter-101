const base = require("./karma.base.config")
const alias_common = require("bu@/alias-common")

/**
 * @param {karma.Config} config the karma config object 
 */
module.exports = function (config) {
    let options = Object.assign(base, {
        browsers: ["ChromeHeadless"],
        reporters: ["mocha", "coverage-istanbul"],
        singleRun: true,
        autoWatch: false,
        logLevel: config.LOG_INFO,
        // optionally, configure the reporter
        coverageIstanbulReporter: {
            reports: ["text-summary", "html"],
            fixWebpackSourcePaths: true,
            dir: "target/coverage",
            "report-config": {

                // all options available at: https://github.com/istanbuljs/istanbul-reports/blob/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib/html/index.js#L135-L137
                html: {
                    // outputs the report in ./coverage/html
                    subdir: "html"
                }

            }
        },
        plugins: base.plugins.concat([
            "karma-chrome-launcher",
            "karma-coverage-istanbul-reporter"
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