const path = require("path");

const resolve = p => path.resolve(__dirname, "../", p)

const allMyPaths = {
    outputPath: resolve("dist/"),
    mainJs: resolve("src/main/js/"),
    mainCss: resolve("src/main/css/"),
    mainHtml: resolve("src/main/html/"),
    jsConfigJson: resolve("jsconfig.json"),
    vueDev: "vue/dist/vue.esm.js",
    vueProd: "vue/dist/vue.runtime.esm.js"
}

module.exports = allMyPaths;