const commonConfig = require("bu@/webpack.common");
const webpackMerge = require("webpack-merge");
const prettyjson = require("prettyjson");

/**
 * Add one or more add-on's to webpack. This addon must be a js file named
 * "webpack.${addonArg}.js" under the path "build-utils/addons". An addon 
 * contains some webpack configuration.
 * @param {string | string[]} addonsArg 
 */
const addons = (addonsArg) => {
    let addons = []
        .concat.apply([], [addonsArg]) /** flattens all addonsArg on second level 
        array into first level array e.g. [["$6"], ["$12"]] => ["$6", "$12"] */
        .filter(Boolean); // if undefined, filter it out
    return addons.map((addonName) => require(`./build-utils/addons/webpack.${addonName}`));
}

module.exports = (env) => {
    if(!env){
        throw new Error("You must pass an --env.env flag into your build for webpack to work!");
    }
    console.log(prettyjson.render(env));

    const envConfig = require(`./build-utils/webpack.${env.env}`);

    const mergeConfig = webpackMerge(commonConfig, envConfig, ...addons(env.addons));

    console.log(prettyjson.render(mergeConfig));

    return mergeConfig;
}