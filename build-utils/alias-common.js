const commonPaths = require("./common-paths");

const alias = {
    "bu@": commonPaths.buildUtilsJs,
    "jsm@": commonPaths.mainJs,
    "jstu@": commonPaths.testUnitJs,
    "css@": commonPaths.mainCss,
    "svg@": commonPaths.mainSvg,
    "html@": commonPaths.mainHtml,
    "~": commonPaths.nodeModules
}

module.exports = alias