const commonPaths = require("./common-paths");

const alias = {
    "jsm@": commonPaths.mainJs,
    "jst@": commonPaths.testJs,
    "css@": commonPaths.mainCss,
    "html@": commonPaths.mainHtml
}

module.exports = alias