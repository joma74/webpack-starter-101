const commonPaths = require("./common-paths");

const config = {
    entry: "./src/main/js/",
    output: {
        filename: "bundle.js",
        path: commonPaths.outputPath
    }
}

module.exports = config;