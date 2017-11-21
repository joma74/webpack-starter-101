const path = require("path");

/**
 * Resolve path againts working dir
 * @param {string} p path segment
 */
const resolve = p => path.resolve(__dirname, "../", p)

const paths = {
    outputPath: resolve("dist/"),
    buildUtilsJs: resolve("build-utils/"),
    mainJs: resolve("src/main/js/"),
    testUnitJs: resolve("src/test/unit/js/"),
    mainCss: resolve("src/main/css/"),
    mainHtml: resolve("src/main/html/"),
    jsConfigJson: resolve("jsconfig.json"),
    vueDev: "vue/dist/vue.esm.js",
    vueProd: "vue/dist/vue.runtime.min.js",
    nodeModules: resolve("node_modules"),
}

module.exports = paths;