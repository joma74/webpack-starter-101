// Karma configuration
// Generated on Fri Sep 15 2017 15:25:15 GMT+0200 (CEST)

module.exports = function (config) {
    /**
     * See https://glebbahmutov.com/blog/debugging-karma-unit-tests/
     */
    /* eslint no-unused-vars: "warn" */
    var sourcePreprocessors = ["coverage"];

    function isNoPreProcs(argument) {
        return argument === "--nopreproc";
    }
    if (process.argv.some(isNoPreProcs)) {
        sourcePreprocessors = [];
    }

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: ".",


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],


        // list of files / patterns to load in the browser
        files: [
            "src/test/unit/js/**/*jasm.js"
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // "index.js": sourcePreprocessors
        },


        // test results reporter to use
        // possible values: "dots", "progress", "mocha"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["mocha", "kjhtml"],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers "Chrome" "Firefox"
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["profiles/firefox/launcher.sh"],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        customLaunchers: {
            ChromeDebugging: {
                base: "Chrome",
                flags: ["--remote-debugging-port=9333"]
            }
        },
    })
}
