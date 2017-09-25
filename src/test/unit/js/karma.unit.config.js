const base = require("./karma.base.config")

/**
 * @param {karma.Config} config the karma config object 
 */
module.exports = function (config) {
    config.set(Object.assign(base, {
        browsers: ["profiles/firefoxLocal/launcher.sh"],
        reporters: ["mocha", "kjhtml"],
        singleRun: false,
        autoWatch: false
    }))
}