const commonConfig = require("./build-utils/webpack.common");
const webpackMerge = require("webpack-merge");
const prettyjson = require("prettyjson");

const addons = (addonsArg) => {
    let addons = []
        .concat.apply([], [addonsArg]) /** flattens all addonsArg on second level 
        array into first level array e.g. [["$6"], ["$12"]] => ["$6", "$12"] */
        .filter(Boolean); // if undefined, filter it out
    return addons.map((addonName) => require(`./build-utils/addons/webpack.${addonName}`));
}

module.exports = (env) => {
    console.log(prettyjson.render(env));

    const envConfig = require(`./build-utils/webpack.${env.env}`);

    const mergeConfig = webpackMerge(commonConfig, envConfig, ...addons(env.addons));

    console.log(prettyjson.render(mergeConfig));

    return mergeConfig;
}