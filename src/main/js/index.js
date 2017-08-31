/* eslint-env browser */

import FOO_STRING from "./foo"
import BAZ_STRING from "js@/components/baz"
import "css@/index.css"

import Vue from "vue";
import TwitterLike from "js@/components/TwitterLike.vue"

const bar = require("./bar")

console.log(`Hello ${FOO_STRING} and hello ${bar.BAR_STRING} plus hello ${BAZ_STRING}`); // This is an ES6 feature

new Vue({
    el: "#twitterlike",
    template: "<TwitterLike></TwitterLike>",
    components: {
        TwitterLike
    }
});