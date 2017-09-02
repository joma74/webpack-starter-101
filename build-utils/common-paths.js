const path = require("path");

const allMyPaths = {
    outputPath: path.resolve(__dirname, "../", "dist/"),
    mainJs: path.resolve(__dirname, "../", "src/main/js/"),
    mainCss: path.resolve(__dirname, "../", "src/main/css/"),
    mainHtml: path.resolve(__dirname, "../", "src/main/html/"),
    jsConfigJson: path.resolve(__dirname, "../", "jsconfig.json"),
    vueDev: "vue/dist/vue.esm.js",
    vueProd: "vue/dist/vue.runtime.esm.js"
}

module.exports = allMyPaths;