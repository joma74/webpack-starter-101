const base = require("./karma.base.config")

/**
 * @param {karma.Config} config the karma config object 
 */
module.exports = function (config) {
    config.set(Object.assign(base, {
        browsers: ["profiles/firefox/launcher.sh"],
        reporters: ["mocha", "kjhtml"],
        singleRun: true,
        plugins: base.plugins.concat([
            "karma-chrome-launcher",
            "karma-firefox-launcher"
        ])
    }))
}