const commonPaths = require("./common-paths");

const alias = {
    "jsm@": commonPaths.mainJs,
    "jstu@": commonPaths.testUnitJs,
    "css@": commonPaths.mainCss,
    "html@": commonPaths.mainHtml
}

module.exports = alias