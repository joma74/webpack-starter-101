const base = require("./karma.base.config")

/**
 * @param {karma.Config} config the karma config object 
 */
module.exports = function (config) {
    let options = Object.assign(base, {
        browsers: ["profiles/firefoxLocal/launcher.sh"],
        reporters: ["mocha", "kjhtml"],
        singleRun: false,
        autoWatch: false,
        plugins: base.plugins.concat([
            "karma-jasmine-html-reporter"
        ])
    })
    config.set(options);
}