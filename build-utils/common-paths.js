const path = require("path");

module.exports = {
    outputPath: path.resolve(__dirname, "../", "dist/"),
    mainJs: path.resolve(__dirname, "../", "src/main/js/"),
    mainCss: path.resolve(__dirname, "../", "src/main/css/"),
    mainHtml: path.resolve(__dirname, "../", "src/main/html/"),
    vueEsm: "vue/dist/vue.esm.js"
}